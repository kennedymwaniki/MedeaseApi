import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entities/prescription.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicationsService } from 'src/medications/medications.service';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,

    private readonly patientsService: PatientsService,
    private readonly medicationsService: MedicationsService,
    private readonly doctorsService: DoctorsService, // Assuming you have a DoctorsService to handle doctor-related logic
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    const patient = await this.patientsService.findOne(
      createPrescriptionDto.patientId,
    );

    const medication = await this.medicationsService.findOne(
      createPrescriptionDto.medicationId,
    );

    const doctor = await this.doctorsService.findOne(
      createPrescriptionDto.doctorId,
    );

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }
    if (!medication) {
      throw new BadRequestException('Medication not found');
    }

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }
    const prescription = this.prescriptionRepository.create({
      ...createPrescriptionDto,
      medicationName: medication.name,
      patient,
      doctor,
      medication,
    });
    console.log('Created prescription:', prescription);
    return this.prescriptionRepository.save(prescription);
  }

  findAll() {
    return this.prescriptionRepository.find({
      relations: {
        patient: {
          user: true, // Only load user info
        },
        doctor: {
          user: true, // Only load user info
        },
        medication: true,
        payment: true,
      },
    });
  }

  findOne(id: number) {
    return this.prescriptionRepository.findOne({
      where: { id },
      relations: {
        patient: {
          user: true,
        },
        doctor: {
          user: true,
        },
        medication: true,
        payment: true,
      },
    });
  }

  update(id: number, updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionRepository.update(id, updatePrescriptionDto);
  }

  remove(id: number) {
    return this.prescriptionRepository.delete(id);
  }
}
