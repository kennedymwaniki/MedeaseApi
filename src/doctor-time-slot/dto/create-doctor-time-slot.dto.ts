import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateDoctorTimeSlotDto {
  @ApiProperty({
    description: 'Date for the time slot',
    example: '2025-07-15',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Start time of the slot',
    example: '10:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot',
    example: '10:30',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Doctor ID',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  doctorId: number;
}
