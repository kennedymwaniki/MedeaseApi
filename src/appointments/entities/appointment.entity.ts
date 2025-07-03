import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @ApiProperty({
    description: 'Unique identifier for the appointment',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Date of the appointment',
    example: '2023-10-01',
  })
  @Column()
  date: string;

  @ApiProperty({
    description: 'Time of the appointment',
    example: '10:00 AM',
  })
  @Column()
  time: string;

  @ApiProperty({
    description: 'Status of the appointment',
    example: 'confirmed',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'Duration of the appointment in minutes',
    example: 30,
  })
  @Column()
  duration: number;

  @ApiProperty({
    description: 'Title or reason for the appointment',
    example: 'Regular Checkup',
  })
  @Column()
  title: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  doctor: Doctor;
}
