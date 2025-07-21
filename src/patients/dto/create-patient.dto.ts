import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNumber, IsString, IsPositive, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Name of the patient',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 30,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: 'User ID of the patient',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'Gender of the patient',
    example: 'Male',
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({
    description: 'Contact information of the patient',
    example: '123-456-7890',
  })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main St, Anytown, USA',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
