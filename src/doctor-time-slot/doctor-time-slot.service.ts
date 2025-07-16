import { Injectable } from '@nestjs/common';
import { CreateDoctorTimeSlotDto } from './dto/create-doctor-time-slot.dto';
import { UpdateDoctorTimeSlotDto } from './dto/update-doctor-time-slot.dto';
import { DoctorTimeSlot } from './entities/doctor-time-slot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoctorTimeSlotService {
  constructor(
    @InjectRepository(DoctorTimeSlot)
    private readonly doctorTimeSlotRepository: Repository<DoctorTimeSlot>,
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
}
