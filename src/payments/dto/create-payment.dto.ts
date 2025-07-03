import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Amount to be paid',
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    example: 'Credit Card',
  })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    description: 'Status of the payment',
    example: 'Pending',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Date of the payment',
    example: '2023-03-15',
  })
  @IsDateString()
  paymentDate: Date;

  @ApiProperty({
    description: 'Transaction ID of the payment',
    example: 'txn_1234567890',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'ID of the patient making the payment',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  patientId: number;

  @ApiProperty({
    description: 'ID of the prescription associated with the payment',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  prescriptionId: number;
}
