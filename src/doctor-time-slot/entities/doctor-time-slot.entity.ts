import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
}

@Entity('doctor-time-slots')
export class DoctorTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Date for the time slot',
    example: '2025-07-15',
  })
  @Column({ type: 'date' })
  date: string;

  @ApiProperty({
    description: 'Start time of the slot',
    example: '10:00',
  })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot',
    example: '10:30',
  })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({
    description: 'Status of the time slot',
    example: 'available',
  })
  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots)
  doctor: Doctor;

  @ApiProperty({
    description: 'ID of the appointment if the slot is booked',
    example: 1,
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  appointmentId: number | null;
}
