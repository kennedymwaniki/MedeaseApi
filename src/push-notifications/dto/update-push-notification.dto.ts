import { PartialType } from '@nestjs/swagger';
import { CreatePushSubscriptionDto } from './create-push-subscription.dto';

export class UpdatePushNotificationDto extends PartialType(
  CreatePushSubscriptionDto,
) {}
