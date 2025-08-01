import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

interface appointmentData {
  doctor: {
    user: {
      email: string;
      firstname: string;
      lastname: string;
    };
    specialization: string;
    experience: number; // Changed from string to number
  };
  date: string;
  time: string;
  duration: number; // Also should be number, not string
  title: string;
  status: string;
  admin_url: string;
  user_url: string;
  patient: {
    name: string;
    age: number; // Changed from string to number
    gender: string;
    contact: string;
    user: {
      email: string;
    };
  };
}

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
        loginUrl: 'https://medeaseapi.onrender.com/auth/login',
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
        resetUrl: 'https://medeaseapi.onrender.com/auth/reset-password',
      },
    });
    console.log(`Password reset email sent to ${user.email}`);
  }

  async sendAppointmentReminderToDoctor(
    appointmentData: appointmentData,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: appointmentData.doctor.user.email,
      subject: "Appointment Reminder - Today's Schedule",
      from: 'MedEase Healthcare Team',
      template: './appointment-reminder-doctor',
      context: {
        doctorName: `${appointmentData.doctor.user.firstname} ${appointmentData.doctor.user.lastname}`,
        appointmentDate: appointmentData.date,
        appointmentTime: appointmentData.time,
        duration: appointmentData.duration,
        appointmentTitle: appointmentData.title,
        status: appointmentData.status,
        patientName: appointmentData.patient.name,
        patientAge: appointmentData.patient.age,
        patientGender: appointmentData.patient.gender,
        patientContact: appointmentData.patient.contact,
        adminUrl: appointmentData.admin_url,
      },
    });
    console.log(
      `Appointment reminder sent to doctor: ${appointmentData.doctor.user.email}`,
    );
  }

  async sendAppointmentReminderToPatient(
    appointmentData: appointmentData,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: appointmentData.patient.user.email,
      subject: 'Appointment Reminder - Your Healthcare Appointment Today',
      from: 'MedEase Healthcare Team',
      template: './appointment-reminder-patient',
      context: {
        patientName: appointmentData.patient.name,
        appointmentDate: appointmentData.date,
        appointmentTime: appointmentData.time,
        duration: appointmentData.duration,
        appointmentTitle: appointmentData.title,
        status: appointmentData.status,
        doctorName: `${appointmentData.doctor.user.firstname} ${appointmentData.doctor.user.lastname}`,
        doctorSpecialization: appointmentData.doctor.specialization,
        doctorExperience: appointmentData.doctor.experience,
        userUrl: appointmentData.user_url,
      },
    });
    console.log(
      `Appointment reminder sent to patient: ${appointmentData.patient.user.email}`,
    );
  }
}
