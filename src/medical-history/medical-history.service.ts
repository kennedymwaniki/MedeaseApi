import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistory } from './entities/medical-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,

    private readonly patientService: PatientsService, // Assuming you have a PatientService to handle patient-related operations
  ) {}

  async create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    const patient = await this.patientService.findOne(
      createMedicalHistoryDto.patientId,
    );
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const newMedicalHistory = this.medicalHistoryRepository.create({
      ...createMedicalHistoryDto,
      patient,
    });
    return this.medicalHistoryRepository.save(newMedicalHistory);
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
