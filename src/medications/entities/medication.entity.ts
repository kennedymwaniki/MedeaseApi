import { ApiProperty } from '@nestjs/swagger';
import { MedicationStock } from 'src/medication-stock/entities/medication-stock.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the medication',
    example: 'Paracetamol',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the medication',
    example: 'Used to treat pain and fever',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Dosage of the medication',
    example: '500mg',
  })
  @Column()
  dosage: string;

  @ApiProperty({
    description: 'Type of the medication',
    example: 'Tablet',
  })
  @Column()
  type: string;

  @ApiProperty({
    description: 'Route of the medication',
    example: 'Oral',
  })
  @Column()
  route: string; // e.g., oral, intravenous, topical, or inhalation injection

  @ApiProperty({
    description: 'Manufacturer of the medication',
    example: 'Pharma Inc.',
  })
  @Column()
  manufacturer: string;

  @ApiProperty({
    description: 'Expiration date of the medication',
    example: '2023-12-31',
  })
  @Column()
  expirationDate: Date;

  @OneToOne(() => MedicationStock, (stock) => stock.medication, {
    eager: true,
  })
  stock: MedicationStock;

  //  one medication can be prescribed in many prescriptions
  @OneToMany(() => Prescription, (prescription) => prescription.medication, {
    eager: true,
  })
  prescriptions: Prescription[];
}
