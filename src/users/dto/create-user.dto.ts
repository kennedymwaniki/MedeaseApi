import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/roleEnums';
// import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'strongpassword123',
    minLength: 6,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'Role of the user',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  otp?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  secret?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hashedRefreshToken?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imagelink?: string | null;
}
