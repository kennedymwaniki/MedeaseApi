import { ApiProperty } from '@nestjs/swagger';
import { Patient } from 'src/patients/entities/patient.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('medical_histories')
export class MedicalHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Symptoms experienced by the patient',
    example: 'Fever, cough, and fatigue',
  })
  @Column()
  symptoms: string;

  @ApiProperty({
    description: 'Diagnosis given to the patient',
    example: 'Influenza',
  })
  @Column()
  diagnosis: string;

  @ApiProperty({
    description: 'Treatment prescribed to the patient',
    example: 'Rest and hydration',
  })
  @Column()
  treatment: string;

  @ApiProperty({
    description: "Additional notes about the patient's medical history",
    example: 'Patient has a history of allergies',
  })
  @Column()
  notes: string;

  @ManyToOne(() => Patient, (patient) => patient.medicalHistories)
  patient: Patient;
}
