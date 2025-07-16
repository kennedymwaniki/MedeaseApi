/* eslint-disable @typescript-eslint/no-unused-vars */
import { PatientsService } from './../patients/patients.service';
import { DoctorsService } from '../doctors/doctors.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ZoomService } from 'src/zoom/zoomService';
// import { ZoomService } from 'src/zoom/zoomService';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
    private readonly zoomService: ZoomService,
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

    return savedAppointment;
  }

  findAll() {
    return this.appointmentsRepository.find({
      relations: ['patient', 'doctor'],
    });
  }

  findOne(id: number) {
    return this.appointmentsRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
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
      relations: ['patient', 'doctor'],
    });
  }
}
