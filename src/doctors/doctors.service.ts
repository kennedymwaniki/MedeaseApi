import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    private readonly userService: UsersService,
  ) {}
  async create(createDoctorDto: CreateDoctorDto) {
    const user = await this.userService.findOne(createDoctorDto.userId);
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
      relations: ['user'],
    });
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorRepository.update(id, updateDoctorDto);
  }

  remove(id: number) {
    return this.doctorRepository.delete(id);
  }
}
