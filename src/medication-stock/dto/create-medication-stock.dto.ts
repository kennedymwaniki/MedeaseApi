import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateMedicationStockDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  medicationId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  currentQuantity: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  minimumQuantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @ApiProperty()
  @IsDateString()
  expirationDate: Date;
}
