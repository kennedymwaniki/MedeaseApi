/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/push-notifications/push-notifications.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { PushSubscription } from './entities/push-subscription.entity';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';
import { ConfigService } from '@nestjs/config';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(
    @InjectRepository(PushSubscription)
    private readonly pushSubscriptionRepository: Repository<PushSubscription>,

    private readonly configService: ConfigService,
  ) {
    // Configure web-push with VAPID keys
    webpush.setVapidDetails(
      this.configService.get<string>('VAPID_SUBJECT') ||
        'mailto:your-email@example.com',
      this.configService.get<string>('VAPID_PUBLIC_KEY')!,
      this.configService.get<string>('VAPID_PRIVATE_KEY')!,
    );
  }

  async subscribe(userId: number, subscriptionData: CreatePushSubscriptionDto) {
    try {
      // Check if subscription already exists
      const existingSubscription =
        await this.pushSubscriptionRepository.findOne({
          where: {
            userId,
            endpoint: subscriptionData.endpoint,
          },
        });

      if (existingSubscription) {
        // Update existing subscription
        existingSubscription.p256dhKey = subscriptionData.keys.p256dh;
        existingSubscription.authKey = subscriptionData.keys.auth;
        existingSubscription.updatedAt = new Date();
        return await this.pushSubscriptionRepository.save(existingSubscription);
      }

      // Create new subscription
      const newSubscription = this.pushSubscriptionRepository.create({
        userId,
        endpoint: subscriptionData.endpoint,
        p256dhKey: subscriptionData.keys.p256dh,
        authKey: subscriptionData.keys.auth,
      });

      return await this.pushSubscriptionRepository.save(newSubscription);
    } catch (error) {
      this.logger.error('Error saving push subscription:', error);
      throw new BadRequestException(`Something`);
    }
  }

  async unsubscribe(userId: number, endpoint: string) {
    try {
      await this.pushSubscriptionRepository.delete({
        userId,
        endpoint,
      });
      return { success: true };
    } catch (error) {
      this.logger.error('Error removing push subscription:', error);
      throw new BadRequestException();
    }
  }

  async sendNotificationToUser(userId: number, payload: NotificationPayload) {
    try {
      const subscriptions = await this.pushSubscriptionRepository.find({
        where: { userId },
      });

      if (subscriptions.length === 0) {
        this.logger.warn(`No push subscriptions found for user ${userId}`);
        return { sent: 0, failed: 0 };
      }

      const promises = subscriptions.map(async (subscription) => {
        try {
          const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dhKey,
              auth: subscription.authKey,
            },
          };

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(payload),
          );

          return { success: true };
        } catch (error: any) {
          this.logger.error(`Error sending push notification:`, error);

          // If subscription is invalid, remove it
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (error.statusCode === 410 || error.statusCode === 404) {
            await this.pushSubscriptionRepository.delete(subscription.id);
            this.logger.log(`Removed invalid subscription: ${subscription.id}`);
          }

          return { success: false, error };
        }
      });

      const results = await Promise.allSettled(promises);
      const sent = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success,
      ).length;
      const failed = results.length - sent;

      this.logger.log(`Push notifications sent: ${sent}, failed: ${failed}`);
      return { sent, failed };
    } catch (error) {
      this.logger.error('Error sending push notifications:', error);
      throw new BadRequestException();
    }
  }

  async sendNotificationToMultipleUsers(
    userIds: number[],
    payload: NotificationPayload,
  ) {
    const results = await Promise.allSettled(
      userIds.map((userId) => this.sendNotificationToUser(userId, payload)),
    );

    const totalSent = results
      .filter((r) => r.status === 'fulfilled')
      .reduce((sum, r) => sum + (r as any).value.sent, 0);

    const totalFailed = results
      .filter((r) => r.status === 'fulfilled')
      .reduce((sum, r) => sum + (r as any).value.failed, 0);

    return { sent: totalSent, failed: totalFailed };
  }

  // Utility method to create appointment notification payload
  createAppointmentNotificationPayload(
    patientName: string,
    doctorName: string,
    date: string,
    time: string,
    appointmentId: number,
  ): NotificationPayload {
    return {
      title: 'New Appointment Scheduled',
      body: `${patientName} has scheduled an appointment with Dr. ${doctorName} on ${date} at ${time}`,
      icon: '/assets/icons/appointment-icon.png',
      badge: '/assets/icons/badge-icon.png',
      data: {
        appointmentId,
        type: 'appointment',
        date,
        time,
      },
      actions: [
        {
          action: 'view',
          title: 'View Details',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
    };
  }

  async getNotificationSubscriptionsByUserId(userId: number) {
    try {
      return await this.pushSubscriptionRepository.find({
        where: { userId },
      });
    } catch (error) {
      this.logger.error('Error fetching push subscriptions:', error);
      throw new BadRequestException();
    }
  }
}
