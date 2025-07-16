import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { UserRole } from '../enums/roleEnums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: UserRole;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  otp: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  secret?: string;

  @Column({ type: 'text', nullable: true, default: null })
  hashedRefreshToken?: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  imagelink?: string | null;

  @OneToOne(() => Patient, (patient) => patient.user, {
    eager: true,
  })
  patient: Patient;

  @OneToOne(() => Doctor, (doctor) => doctor.user, {
    eager: true,
  })
  doctor: Doctor;
}
