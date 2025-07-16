import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentStatus } from '../appointmentEnum';

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
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.CONFIRMED,
  })
  status: AppointmentStatus;

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

  @ApiProperty({
    description: 'Zoom meeting ID associated with the appointment',
    example: '123456789',
    required: false,
  })
  @Column({ nullable: true })
  zoomMeetingId?: string;

  @ApiProperty({
    description: 'Zoom meeting URL for the appointment for the user(patient',
    example: 'https://zoom.us/j/123456789',
    required: false,
  })
  @Column({ nullable: true })
  user_url?: string;

  @ApiProperty({
    description: 'Zoom meeting URL for the appointment for the admin',
    example: 'https://zoom.us/s/123456789',
    required: false,
  })
  @Column({ nullable: true })
  admin_url?: string;
}
