/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entities/prescription.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicationsService } from 'src/medications/medications.service';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,

    private readonly patientsService: PatientsService,
    private readonly medicationsService: MedicationsService,
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    const patient = await this.patientsService.findOne(
      createPrescriptionDto.patientId,
    );

    const medication = await this.medicationsService.findOne(
      createPrescriptionDto.medicationId,
    );

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }
    if (!medication) {
      throw new BadRequestException('Medication not found');
    }

    const prescription = this.prescriptionRepository.create({
      ...createPrescriptionDto,
      patient,
      medication,
    });
    return this.prescriptionRepository.save(prescription);
  }

  findAll() {
    return this.prescriptionRepository.find();
  }

  findOne(id: number) {
    return this.prescriptionRepository.findOne({ where: { id } });
  }

  update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionRepository.update(id, updatePrescriptionDto);
  }

  remove(id: number) {
    return this.prescriptionRepository.delete(id);
  }
}
