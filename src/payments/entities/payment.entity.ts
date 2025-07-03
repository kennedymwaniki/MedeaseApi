import { ApiProperty } from '@nestjs/swagger';
import { Patient } from 'src/patients/entities/patient.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Amount to be paid',
    example: 100.5,
  })
  @Column()
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    example: 'Credit Card',
  })
  @Column()
  method: string;

  @ApiProperty({
    description: 'Status of the payment',
    example: 'Pending',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'Date of the payment',
    example: '2023-03-15',
  })
  @Column()
  paymentDate: Date;

  @ApiProperty({
    description: 'Transaction ID of the payment',
    example: 'txn_1234567890',
  })
  @Column()
  transactionId: string;

  @ManyToOne(() => Patient, (patient) => patient.payments, { eager: true })
  patient: Patient;

  @OneToOne(() => Prescription, (prescription) => prescription.payment, {
    eager: true,
  })
  @JoinColumn()
  prescription: Prescription;
}
