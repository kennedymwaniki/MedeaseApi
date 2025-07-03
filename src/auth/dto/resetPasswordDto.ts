import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ResetPasswordDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Email of the user requesting password reset',
    example: 'jane@gmail.com',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'One Time Password for resetting the password',
    example: '123456',
  })
  @IsOptional()
  otp?: string;

  @ApiProperty({
    description: 'Secret key for password reset from the users email',
    example: 'my-secret-key',
  })
  @IsOptional()
  secret?: string;
}
