/* eslint-disable @typescript-eslint/no-unused-vars */
import { PatientsService } from './../patients/patients.service';
import { DoctorsService } from '../doctors/doctors.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ZoomService } from 'src/zoom/zoomService';
import { PushNotificationsService } from 'src/push-notifications/push-notifications.service';
import { MailService } from 'src/mail/mail.service';
// import { ZoomService } from 'src/zoom/zoomService';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
    private readonly zoomService: ZoomService,
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly mailService: MailService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const patient = await this.patientsService.findOne(
      createAppointmentDto.patientId,
    );
    const doctor = await this.doctorsService.findOne(
      createAppointmentDto.doctorId,
    );

    if (!patient) {
      throw new Error('Patient not found');
    }
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Fix the date-time combination
    const startDateTime = `${createAppointmentDto.date}T${createAppointmentDto.time}`;

    const { start_url, join_url, meeting_id } =
      await this.zoomService.createMeeting(
        createAppointmentDto.title,
        startDateTime,
        createAppointmentDto.duration,
      );

    console.log('Zoom meeting created at appointment service:', {
      start_url,
      join_url,
      meeting_id,
    });

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      patient: patient,
      doctor: doctor,
      user_url: join_url,
      admin_url: start_url,
      zoomMeetingId: meeting_id,
    });

    const savedAppointment =
      await this.appointmentsRepository.save(appointment);

    // Book the time slot
    try {
      await this.doctorsService.bookTimeSlot(
        createAppointmentDto.doctorId,
        createAppointmentDto.date,
        createAppointmentDto.time,
        savedAppointment.id,
      );
      // console.log('Time slot booked successfully');
    } catch (error) {
      await this.appointmentsRepository.delete(savedAppointment.id);
      throw new NotFoundException('Time slot not available');
    }

    try {
      // Create consistent notification payloads for both doctor and patient
      const doctorNotificationPayload = {
        title: 'New Appointment Scheduled',
        body: `${patient.name || patient.user.email} has scheduled an appointment with you on ${createAppointmentDto.date} at ${createAppointmentDto.time}`,
        icon: '/assets/icons/appointment-icon.png',
        data: {
          appointmentId: savedAppointment.id,
          type: 'new_appointment',
        },
      };

      const patientNotificationPayload = {
        title: 'Appointment Confirmed',
        body: `Your appointment with Dr. ${doctor.user.firstname} ${doctor.user.lastname} on ${createAppointmentDto.date} at ${createAppointmentDto.time} has been confirmed.`,
        icon: '/assets/icons/appointment-icon.png',
        data: {
          appointmentId: savedAppointment.id,
          type: 'appointment_confirmation',
        },
      };

      // Send email reminders
      const appointmentData = {
        doctor: {
          user: {
            email: doctor.user.email,
            firstname: doctor.user.firstname,
            lastname: doctor.user.lastname,
          },
          specialization: doctor.specialization || '',
          experience: doctor.experience || 0, // Ensure it's a number
        },
        date: createAppointmentDto.date,
        time: createAppointmentDto.time,
        duration: createAppointmentDto.duration,
        title: createAppointmentDto.title,
        status: savedAppointment.status,
        admin_url: savedAppointment.admin_url || '',
        user_url: savedAppointment.user_url || '',
        patient: {
          name: patient.name || '',
          age: patient.age || 0,
          gender: patient.gender || '',
          contact: patient.contact || '',
          user: {
            email: patient.user.email,
          },
        },
      };

      // Send emails in parallel
      await Promise.all([
        this.mailService.sendAppointmentReminderToDoctor(appointmentData),
        this.mailService.sendAppointmentReminderToPatient(appointmentData),
      ]);

      // Send push notifications
      const patientResult =
        await this.pushNotificationsService.sendNotificationToUser(
          patient.user.id,
          patientNotificationPayload,
        );

      const doctorResult =
        await this.pushNotificationsService.sendNotificationToUser(
          doctor.user.id,
          doctorNotificationPayload,
        );

      console.log('Push notification results:', {
        patient: patientResult,
        doctor: doctorResult,
      });

      return {
        message:
          'Appointment created and notifications sent to both doctor and patient',
        notificationResults: {
          patient: patientResult,
          doctor: doctorResult,
        },
      };
    } catch (error) {
      console.error('Failed to send notifications:', error);
      // Don't fail the appointment creation if notification fails
      return {
        message: 'Appointment created but notification sending failed',
        appointment: savedAppointment,
      };
    }

    return savedAppointment;
  }

  findAll() {
    return this.appointmentsRepository.find({
      relations: {
        patient: {
          user: true,
        },
        doctor: {
          user: true,
        },
      },
    });
  }

  findOne(id: number) {
    return this.appointmentsRepository.findOne({
      where: { id },
      relations: {
        patient: {
          user: true,
        },
      },
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.appointmentsRepository.update(id, updateAppointmentDto);
  }

  async remove(id: number) {
    // Release the time slot when appointment is cancelled
    await this.doctorsService.releaseTimeSlot(id);
    return this.appointmentsRepository.delete(id);
  }

  // Method to get appointments for today
  async getAppointmentsForToday() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    return this.appointmentsRepository.find({
      where: {
        date: todayString,
      },
      relations: {
        patient: {
          user: true,
        },
        doctor: {
          user: true,
        },
      },
    });
  }
}
