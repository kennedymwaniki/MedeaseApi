/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as speakeasy from 'speakeasy';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/users/enums/roleEnums';
import { MailService } from 'src/mail/mail.service';
import { CreateAuthDto } from './dto/lgon.dto';
import { ResetPasswordDto } from './dto/resetPasswordDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  public async login(
    body: CreateAuthDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const email = body.email;
    const password = body.password;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(`User with email ${email} does not exist`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
      user.role,
    );

    await this.usersService.saveRefreshToken(user.id, refreshToken);
    
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        otp: user.otp,
        secret: user.secret,
        firstName: user.firstname,
        refreshtoken: user.hashedRefreshToken,
        patient: user.patient,
        doctor: user.doctor,
      },
      // user
    };
  }

  private async getTokens(userId: number, email: string, role: UserRole) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role: role,
          // userrole: role,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  async signOut(id: number) {
    const res = await this.usersService.update(id, {
      hashedRefreshToken: null,
    });

    if (!res) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: `User with id : ${id} signed out successfully` };
  }

  // Method to refresh tokens
  async refreshTokens(id: number, refreshToken: string) {
    // get user
    const foundUser = await this.usersService.findOne(id);

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!foundUser.hashedRefreshToken) {
      throw new NotFoundException('No refresh token found');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      foundUser.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new NotFoundException('Invalid refresh token');
    }
    // generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      foundUser.id,
      foundUser.email,
      foundUser.role,
    );

    await this.usersService.saveRefreshToken(foundUser.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private generateOtp() {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const otp = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
      step: 240,
      digits: 6,
    });
    /// type of otp and secret validatiob

    console.log('Generated OTP and Secret types ...........:');
    console.log(typeof otp, typeof secret);
    console.log('End of types for otp and secret...........');
    return { otp, secret };
  }

  async sendEmailResetOtp(body: { email: string }) {
    const email = body.email;
    const user = await this.usersService.findUserByEmail(email);
    console.log('user in auth service for refresh is', user);
    if (!user) {
      throw new NotFoundException(
        `User with email ${email} in sendEmailResetOtp not found`,
      );
    }
    const id = user.id;
    const { otp, secret } = this.generateOtp();

    await this.usersService.update(id, {
      otp,
      secret,
    });
    await this.mailService.sendPasswordResetEmail(user, otp, secret);
    return { otp, secret };
  }

  async resetPassword(body: ResetPasswordDto) {
    const email = body.email;
    const otp = body.otp;

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (!user.secret || !user.otp) {
      throw new BadRequestException('Missing OTP or secret');
    }

    console.log('user in resetPassword', {
      secret: user.secret,
      otp: otp,
    });

    const id = user.id;

    const isValidOtp = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: otp!,
      step: 240,
      digits: 6,
      window: 0,
    });

    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Add logic to actually reset the password
    if (body.password) {
      await this.usersService.update(id, {
        password: body.password,
        otp: '',
        secret: '',
      });

      return { message: 'Password reset successful' };
    } else {
      throw new BadRequestException('New password is required');
    }
  }
}
