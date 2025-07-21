import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'what field the doctor is specialized in',
    example: 'Cardiology',
  })
  @IsString()
  @IsOptional()
  specialization?: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  experience?: number;

  @ApiProperty({
    description: 'The id or the user to be associated with the doctor',
  })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Phone number of the doctor',
    example: '123-456-7890',
  })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty({
    description: 'Availability status of the doctor',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Affiliation of the doctor',
    example: 'Part time or Full time',
  })
  @IsString()
  @IsOptional()
  affiliation?: string;
}
