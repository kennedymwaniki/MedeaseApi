import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Appointment } from 'src/appointments/entities/appointment.entity';
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
  @Column()
  specialization: string;

  @ApiProperty({
    description: 'Years of experience of the doctor',
    example: 10,
  })
  @Column()
  experience: number;

  @ApiProperty({
    description: 'Contact information of the doctor',
    example: '123-456-7890',
  })
  @Column()
  contact: string;

  @ApiProperty({
    description: 'Availability status of the doctor',
    example: true,
  })
  @Column()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Affiliation of the doctor',
    example: 'Full-time',
  })
  @Column()
  affiliation: string; // fulltime  or part time

  @OneToOne(() => User, (user) => user.doctor)
  @JoinColumn()
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor, {
    eager: true,
  })
  appointments: Appointment[];
}
