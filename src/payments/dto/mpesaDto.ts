import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class MpesaDto {
  @ApiProperty({
    description: 'Phone number of the user',
    example: '+254712345678',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Amount to be paid',
    example: 1000,
  })
  @IsNotEmpty()
  @IsInt()
  amount: number;
}
