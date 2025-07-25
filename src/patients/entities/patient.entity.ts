// import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the patient',
    example: 'John Doe',
  })
  @Column({
    nullable: true,
  })
  name?: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 30,
  })
  @Column({
    nullable: true,
  })
  age?: number;

  @ApiProperty({
    description: 'Gender of the patient',
    example: 'Male',
  })
  @Column({
    nullable: true,
  })
  gender?: string;

  @ApiProperty({
    description: 'Contact information of the patient',
    example: '123-456-7890',
  })
  @Column({
    nullable: true,
  })
  contact?: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main St, Anytown, USA',
  })
  @Column({
    nullable: true,
  })
  address?: string;

  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    cascade: true,
  })
  appointments: Appointment[];

  @OneToMany(() => Prescription, (prescription) => prescription.patient, {
    cascade: true,
  })
  prescriptions: Prescription[];

  @OneToMany(() => MedicalHistory, (medicalHistory) => medicalHistory.patient, {
    cascade: true,
  })
  medicalHistories: MedicalHistory[];

  @OneToMany(() => Payment, (payment) => payment.patient)
  payments: Payment[];
}
