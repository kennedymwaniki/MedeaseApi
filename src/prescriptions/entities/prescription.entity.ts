import { ApiProperty } from '@nestjs/swagger';
import { Medication } from 'src/medications/entities/medication.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Column, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { prescriptionStatus } from '../prescriptionStatues';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Duration of the prescription',
    example: '7 days',
  })
  @Column()
  frequency: string;

  @ApiProperty({
    description: 'Name of the medication',
    example: 'Amoxicillin',
  })
  @Column()
  medicationName: string;

  @ApiProperty({
    description: 'Dosage of the medication',
    example: '500mg',
  })
  @Column()
  dosage: string;

  @ApiProperty({
    description: 'Status of the prescription',
    example: 'Active',
  })
  @Column({
    type: 'enum',
    enum: prescriptionStatus,
    default: prescriptionStatus.ACTIVE,
  })
  status: prescriptionStatus;

  @ApiProperty({
    description: 'Start date of the prescription',
    example: '2023-03-15',
  })
  @Column()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the prescription',
    example: '2023-03-22',
  })
  @Column()
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean = false;

  @ManyToOne(() => Patient, (patient) => patient.prescriptions)
  patient: Patient;

  @OneToOne(() => Payment, (payment) => payment.prescription)
  payment: Payment;

  @ManyToOne(() => Medication, (medication) => medication.prescriptions)
  medication: Medication;

  @ManyToOne(() => Doctor, (doctor) => doctor.prescriptions)
  doctor: Doctor;
}
