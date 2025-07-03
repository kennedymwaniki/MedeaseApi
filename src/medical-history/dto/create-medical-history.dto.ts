import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMedicalHistoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  symptoms: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  treatment: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  patientId: number;
}
