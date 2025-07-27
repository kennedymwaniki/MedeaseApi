// src/push-notifications/push-notifications.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/AccessTokenGuard';
import { JWTPayload } from 'src/auth/strategies/AccessTokenStrategy';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';
import { PushNotificationsService } from './push-notifications.service';
import { Public } from 'src/auth/decorators/public.decorators';
import { UserRole } from 'src/users/enums/roleEnums';
import { Roles } from 'src/auth/decorators/roles.decorators';

interface UserRequest extends Request {
  user: JWTPayload;
}

@UseGuards(AccessTokenGuard)
@ApiTags('push-notifications')
@Controller('push-notifications')
@ApiBearerAuth()
export class PushNotificationsController {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  @Get('vapid-public-key')
  @Public()
  @ApiOperation({
    summary: 'Get VAPID public key for client-side subscription',
  })
  getVapidPublicKey() {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
    };
  }

  @Post('subscribe')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Subscribe to push notifications' })
  async subscribe(
    @Req() req: UserRequest,
    @Body() subscriptionData: CreatePushSubscriptionDto,
  ) {
    const userId = req.user.sub; // Use 'sub' property which contains the user ID
    return await this.pushNotificationsService.subscribe(
      userId,
      subscriptionData,
    );
  }

  @Delete('unsubscribe')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Unsubscribe from push notifications' })
  async unsubscribe(
    @Req() req: UserRequest,
    @Body() body: { endpoint: string },
  ) {
    const userId = req.user.sub; // Use 'sub' property which contains the user ID
    return await this.pushNotificationsService.unsubscribe(
      userId,
      body.endpoint,
    );
  }

  @Get('user-notifications')
  async getUserNotifications(@Req() req: UserRequest) {
    const userId = req.user.sub;
    return await this.pushNotificationsService.getNotificationSubscriptionsByUserId(
      userId,
    );
  }
}
