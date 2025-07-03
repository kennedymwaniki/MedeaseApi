import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Date of the appointment',
    example: '2023-10-01',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Time of the appointment',
    example: '10:00 AM',
  })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    description: 'Status of the appointment',
    example: 'confirmed',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Duration of the appointment in minutes',
    example: 30,
  })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({
    description: 'Title of the appointment',
    example: 'Dental Checkup',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'ID of the patient',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({
    description: 'ID of the doctor',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  doctorId: number;
}
