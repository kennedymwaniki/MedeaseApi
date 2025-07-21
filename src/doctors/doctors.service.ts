import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DoctorTimeSlot,
  TimeSlotStatus,
} from 'src/doctor-time-slot/entities/doctor-time-slot.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(DoctorTimeSlot)
    private readonly timeSlotRepository: Repository<DoctorTimeSlot>,
  ) {}
  async create(createDoctorDto: CreateDoctorDto) {
    const user = await this.usersService.findOne(createDoctorDto.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const doctor = this.doctorRepository.create({
      ...createDoctorDto,
      user,
    });
    return this.doctorRepository.save(doctor);
  }

  findAll() {
    return this.doctorRepository.find({
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.doctorRepository.findOne({
      where: { id },
      relations: ['user', 'prescriptions'],
    });
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorRepository.update(id, updateDoctorDto);
  }

  remove(id: number) {
    return this.doctorRepository.delete(id);
  }

  // Generate time slots for a doctor for a specific date
  async generateTimeSlots(doctorId: number, date: string) {
    const doctor = await this.findOne(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Check if slots already exist for this date
    const existingSlots = await this.timeSlotRepository.find({
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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const timeSlot = this.timeSlotRepository.create({
          date,
          startTime,
          endTime,
          status: TimeSlotStatus.AVAILABLE,
          doctor,
        });

        timeSlots.push(timeSlot);
      }
    }

    return this.timeSlotRepository.save(timeSlots);
  }

  // Get available time slots for a doctor on a specific date
  async getAvailableTimeSlots(doctorId: number, date: string) {
    // Generate slots if they don't exist
    await this.generateTimeSlots(doctorId, date);

    return this.timeSlotRepository.find({
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

    return this.timeSlotRepository.find({
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
    const timeSlot = await this.timeSlotRepository.findOne({
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

    return this.timeSlotRepository.save(timeSlot);
  }

  //! release a time slot (when appointment is cancelled)
  async releaseTimeSlot(appointmentId: number) {
    const timeSlot = await this.timeSlotRepository.findOne({
      where: { appointmentId },
    });

    if (timeSlot) {
      timeSlot.status = TimeSlotStatus.AVAILABLE;
      timeSlot.appointmentId = null;
      return this.timeSlotRepository.save(timeSlot);
    }
  }
}
