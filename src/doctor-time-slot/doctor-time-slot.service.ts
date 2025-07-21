/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDoctorTimeSlotDto } from './dto/create-doctor-time-slot.dto';
import { UpdateDoctorTimeSlotDto } from './dto/update-doctor-time-slot.dto';
import {
  DoctorTimeSlot,
  TimeSlotStatus,
} from './entities/doctor-time-slot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class DoctorTimeSlotService {
  constructor(
    @InjectRepository(DoctorTimeSlot)
    private readonly doctorTimeSlotRepository: Repository<DoctorTimeSlot>,
    private readonly doctorService: DoctorsService,
  ) {}
  create(createDoctorTimeSlotDto: CreateDoctorTimeSlotDto) {
    return this.doctorTimeSlotRepository.save(createDoctorTimeSlotDto);
  }

  findAll() {
    return this.doctorTimeSlotRepository.find();
  }

  findOne(id: number) {
    return this.doctorTimeSlotRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateDoctorTimeSlotDto: UpdateDoctorTimeSlotDto) {
    return this.doctorTimeSlotRepository.update(id, updateDoctorTimeSlotDto);
  }

  remove(id: number) {
    return this.doctorTimeSlotRepository.delete(id);
  }

  // Generate time slots for a doctor for a specific date
  async generateTimeSlots(doctorId: number, date: string) {
    const doctor = await this.doctorService.findOne(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Check if slots already exist for this date
    const existingSlots = await this.doctorTimeSlotRepository.find({
      where: { doctor: { id: doctorId }, date },
    });

    if (existingSlots.length > 0) {
      return existingSlots;
    }

    // generate 30-minute slots from 8 AM to 5 PM
    const timeSlots: DoctorTimeSlot[] = [];
    const startHour = 8;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = minute + 30;
        const endHour = endMinute === 60 ? hour + 1 : hour;
        const endTime = `${endHour.toString().padStart(2, '0')}:${(endMinute % 60).toString().padStart(2, '0')}`;

        const timeSlot = this.doctorTimeSlotRepository.create({
          date,
          startTime,
          endTime,
          status: TimeSlotStatus.AVAILABLE,
          doctor,
        });

        timeSlots.push(timeSlot);
      }
    }

    return this.doctorTimeSlotRepository.save(timeSlots);
  }

  // Get available time slots for a doctor on a specific date
  async getAvailableTimeSlots(doctorId: number, date: string) {
    // Generate slots if they don't exist
    await this.generateTimeSlots(doctorId, date);

    return this.doctorTimeSlotRepository.find({
      where: {
        doctor: { id: doctorId },
        date,
        status: TimeSlotStatus.AVAILABLE,
      },
      order: { startTime: 'ASC' },
    });
  }

  //! get all time slots for a doctor on a specific date remember to use in frontend
  //! this will return all slots including booked and available
  async getAllTimeSlots(doctorId: number, date: string) {
    await this.generateTimeSlots(doctorId, date);

    return this.doctorTimeSlotRepository.find({
      where: { doctor: { id: doctorId }, date },
      order: { startTime: 'ASC' },
      relations: ['appointment'],
    });
  }

  // Book a time slot
  async bookTimeSlot(
    doctorId: number,
    date: string,
    startTime: string,
    appointmentId: number,
  ) {
    const timeSlot = await this.doctorTimeSlotRepository.findOne({
      where: {
        doctor: { id: doctorId },
        date,
        startTime,
        status: TimeSlotStatus.AVAILABLE,
      },
    });

    if (!timeSlot) {
      throw new BadRequestException('Time slot not available');
    }

    timeSlot.status = TimeSlotStatus.BOOKED;
    timeSlot.appointmentId = appointmentId;

    return this.doctorTimeSlotRepository.save(timeSlot);
  }

  //! release a time slot (when appointment is cancelled)
  async releaseTimeSlot(appointmentId: number) {
    const timeSlot = await this.doctorTimeSlotRepository.findOne({
      where: { appointmentId },
    });

    if (timeSlot) {
      timeSlot.status = TimeSlotStatus.AVAILABLE;
      timeSlot.appointmentId = null;
      return this.doctorTimeSlotRepository.save(timeSlot);
    }
  }
}
