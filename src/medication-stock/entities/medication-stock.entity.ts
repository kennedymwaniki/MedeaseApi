import { ApiProperty } from '@nestjs/swagger';
import { Medication } from 'src/medications/entities/medication.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('medication_stocks')
export class MedicationStock {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique identifier for the medication',
    example: 1,
  })
  @Column()
  medicationId: number;

  @ApiProperty({
    description: 'Current quantity of the medication in stock',
    example: 100,
  })
  @Column()
  currentQuantity: number;

  @ApiProperty({
    description: 'Minimum quantity of the medication that should be in stock',
    example: 50,
  })
  @Column()
  minimumQuantity: number;

  @ApiProperty({
    description: 'Location of the medication in the pharmacy',
    example: 'Aisle 3, Shelf B',
  })
  @Column()
  location: string;

  @ApiProperty({
    description: 'Batch number of the medication',
    example: 'BATCH12345',
  })
  @Column()
  batchNumber: string;

  @ApiProperty({
    description: 'Expiration date of the medication',
    example: '2023-12-31',
  })
  @Column()
  expirationDate: Date;

  @OneToOne(() => Medication, (medication) => medication.stock)
  @JoinColumn()
  medication: Medication;
}
