import { Injectable } from '@nestjs/common';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}

  create(createMedicationDto: CreateMedicationDto) {
    return this.medicationRepository.save(createMedicationDto);
  }

  findAll() {
    return this.medicationRepository.find();
  }

  findOne(id: number) {
    return this.medicationRepository.findOne({
      where: { id },
      relations: {
        stock: true,
        prescriptions: true,
      },
    });
  }

  update(id: number, updateMedicationDto: UpdateMedicationDto) {
    return this.medicationRepository.update(id, updateMedicationDto);
  }

  remove(id: number) {
    return this.medicationRepository.delete(id);
  }
}
