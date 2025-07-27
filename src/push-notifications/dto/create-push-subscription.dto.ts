// src/push-notifications/dto/create-push-subscription.dto.ts
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PushSubscriptionKeys {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class CreatePushSubscriptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({ type: PushSubscriptionKeys })
  @IsObject()
  @ValidateNested()
  @Type(() => PushSubscriptionKeys)
  keys: PushSubscriptionKeys;
}
