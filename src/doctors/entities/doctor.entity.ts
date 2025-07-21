import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { DoctorTimeSlot } from 'src/doctor-time-slot/entities/doctor-time-slot.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Specialization of the doctor',
    example: 'Cardiologist',
  })
  @Column({ nullable: true })
  specialization?: string;

  @ApiProperty({
    description: 'Years of experience of the doctor',
    example: 10,
  })
  @Column({ nullable: true })
  experience?: number;

  @ApiProperty({
    description: 'Contact information of the doctor',
    example: '123-456-7890',
  })
  @Column({ nullable: true })
  contact?: string;

  @ApiProperty({
    description: 'Availability status of the doctor',
    example: true,
  })
  @Column({ nullable: true })
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Affiliation of the doctor',
    example: 'Full-time',
  })
  @Column({ nullable: true })
  affiliation?: string;

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor, {
    eager: true,
  })
  appointments: Appointment[];

  @OneToMany(() => DoctorTimeSlot, (timeSlot) => timeSlot.doctor)
  timeSlots: DoctorTimeSlot[];

  @OneToMany(() => Prescription, (prescription) => prescription.doctor, {
    eager: true,
  })
  prescriptions: Prescription[];
}
