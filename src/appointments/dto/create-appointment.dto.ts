import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { AppointmentStatus } from '../appointmentEnum';

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
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus = AppointmentStatus.PENDING;

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

  @ApiProperty({
    description: 'Zoom meeting ID associated with the appointment',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  user_url?: string;

  @ApiProperty({
    description: 'Zoom meeting URL for the appointment for the admin',
    example: 'https://zoom.us/s/123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  admin_url?: string;
}
