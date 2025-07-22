/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DoctorsService } from 'src/doctors/doctors.service';
import { MailService } from 'src/mail/mail.service';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm/repository/Repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => PatientsService))
    private readonly patientService: PatientsService,
    @Inject(forwardRef(() => DoctorsService))
    private readonly doctorsService: DoctorsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    createUserDto.password = hashedPassword;

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    if (!savedUser || !savedUser.id) {
      throw new BadRequestException(
        'Failed to create user - invalid ID generated',
      );
    }

    console.log('This is the saved User', savedUser);

    // Send welcome email (but don't let it block user creation if it fails)
    try {
      await this.mailService.sendWelcomeUserEmail(savedUser);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with user creation process
    }

    // Validate ID is a valid number before creating related records
    const userId = savedUser.id;
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Invalid user ID generated');
    }

    if (savedUser.role === 'patient') {
      console.log('Creating patient record for user:', savedUser);
      try {
        const patient = await this.patientService.create({
          userId: userId,
          name: `${savedUser.firstname} ${savedUser.lastname}`,
        });
        return {
          user: savedUser,
          patient: patient,
        };
      } catch (error: any) {
        console.error('Error creating patient:', error);
        // Optionally delete the user if patient creation fails
        await this.userRepository.delete(userId);
        throw new BadRequestException(
          `Failed to create patient profile: ${error}`,
        );
      }
    } else if (savedUser.role === 'doctor') {
      try {
        const doctor = await this.doctorsService.create({
          userId: userId,
        });
        return {
          user: savedUser,
          doctor: doctor,
        };
      } catch (error) {
        console.error('Error creating doctor:', error);
        // Optionally delete the user if doctor creation fails
        await this.userRepository.delete(userId);
        throw new BadRequestException(
          `Failed to create doctor profile: ${error}`,
        );
      }
    }

    console.log(`User with email ${savedUser.email} created successfully`);
    return { user: savedUser };
  }

  findAll() {
    return this.userRepository.find({
      relations: ['patient', 'doctor'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        otp: true,
        imagelink: true,
        secret: true,
        firstname: true,
        hashedRefreshToken: true,
        doctor: true,
        patient: true,
      },
      relations: ['patient', 'doctor'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // check if a new password is provided
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
      await this.userRepository.update(id, updateUserDto).then(() => {
        return this.userRepository.findOneBy({ id });
      });
    }

    return this.userRepository.update(id, updateUserDto).then(async () => {
      const updatedUser = await this.userRepository.findOneBy({ id });
      if (!updatedUser) {
        throw new NotFoundException(
          `User with ID ${id} not found after update`,
        );
      }
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        otp: updatedUser.otp,
        imagelink: updatedUser.imagelink,
        secret: updatedUser.secret,
        firstname: updatedUser.firstname,
        hashedRefreshToken: updatedUser.hashedRefreshToken,
        doctor: updatedUser.doctor,
        patient: updatedUser.patient,
      };
    });
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  public async findUserByEmail(email: string) {
    const User = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!User) {
      console.log('User not found');
      throw new BadRequestException(`A user with such an email does not exist`);
    }
    console.log(`User with email ${email} found`);
    return User;
  }

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }

  public async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
