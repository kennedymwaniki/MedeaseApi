import { PatientsService } from './../patients/patients.service';
import { DoctorsService } from './../doctors/doctors.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
  ) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const user = await this.patientsService.findOne(
      createAppointmentDto.patientId,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const doctor = await this.doctorsService.findOne(
      createAppointmentDto.doctorId,
    );
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      patient: user,
      doctor: doctor,
    });

    return this.appointmentsRepository.save(appointment);
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

  remove(id: number) {
    return this.appointmentsRepository.delete(id);
  }
}
