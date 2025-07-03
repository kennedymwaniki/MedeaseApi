import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Name of the patient',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Age of the patient',
    example: 30,
  })
  @IsNumber()
  @IsPositive()
  age: number;

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
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'Contact information of the patient',
    example: '123-456-7890',
  })
  @IsString()
  @IsNotEmpty()
  contact: string;

  @ApiProperty({
    description: 'Address of the patient',
    example: '123 Main St, Anytown, USA',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
