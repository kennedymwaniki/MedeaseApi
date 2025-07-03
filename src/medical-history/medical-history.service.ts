import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistory } from './entities/medical-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}

  create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return this.medicalHistoryRepository.save(createMedicalHistoryDto);
  }

  findAll() {
    return this.medicalHistoryRepository.find();
  }

  findOne(id: number) {
    return this.medicalHistoryRepository.findOne({ where: { id } });
  }

  update(id: number, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    return this.medicalHistoryRepository.update(id, updateMedicalHistoryDto);
  }

  remove(id: number) {
    return this.medicalHistoryRepository.delete(id);
  }
}
