import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { prescriptionStatus } from '../prescriptionStatues';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'Frequency of the medication',
    example: 'Twice a day',
  })
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty({
    description: 'Duration of the medication',
    example: '7 days',
  })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({
    description: 'Name of the medication',
    example: 'Amoxicillin',
  })
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty({
    description: 'Status of the prescription',
    example: 'Active',
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(prescriptionStatus)
  status: prescriptionStatus;

  @ApiProperty({
    description: 'Start date of the prescription',
    example: '2023-03-15',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'End date of the prescription',
    example: '2023-03-22',
  })
  @IsDateString()
  endDate: Date;

  @ApiProperty({
    description: 'ID of the patient associated with the prescription',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({
    description: 'ID of the doctor associated with the prescription',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  doctorId: number;

  @ApiProperty({
    description: 'ID of the medication associated with the prescription',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  medicationId: number;
}
