import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { PasswordResetRequestDto } from './dto/resetRequestDto';
import { CreateAuthDto } from './dto/lgon.dto';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { Public } from './decorators/public.decorators';
import { RefreshTokenGuard } from './guards/RefreshTokenGuard';
import { AccessTokenGuard } from './guards/AccessTokenGuard';

export interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    refreshToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: CreateAuthDto) {
    return this.authService.login(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout/:id')
  signOut(@Param('id') id: number) {
    return this.authService.signOut(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @Query('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    const user = req.user;
    if (user.sub !== id) {
      throw new UnauthorizedException('Invalid user');
    }
    return this.authService.refreshTokens(id, user.refreshToken);
  }

  @Post('password-reset-request')
  @Public()
  @ApiOperation({ summary: 'Request password reset email with OTP' })
  public async requestEmailReset(@Body() body: PasswordResetRequestDto) {
    console.log('this is the requestEmail ', { body });
    return this.authService.sendEmailResetOtp(body);
  }

  @Post('password-reset')
  @Public()
  @ApiOperation({ summary: 'Reset password using OTP' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
