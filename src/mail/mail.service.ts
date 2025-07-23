import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeUserEmail(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to MedEase - Your Healthcare Management Platform',
      from: 'MedEase Healthcare Team',
      template: './welcome',
      context: {
        name: user.firstname,
        email: user.email,
        loginUrl: 'https://medeaseapi.onrender.com/auth/login', // Update this to your actual login URL
      },
    });
    console.log(`Welcome email sent to ${user.email}`);
  }

  async sendPasswordResetEmail(
    user: User,
    otp: string,
    secret: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      from: 'EventOasis Dev Team',
      template: './otp',
      context: {
        username: user.firstname,
        email: user.email,
        otp,
        secret,
        resetUrl: 'https://eventoasisapi.onrender.com/auth/reset-password',
      },
    });
    console.log(`Password reset email sent to ${user.email}`);
  }
}
