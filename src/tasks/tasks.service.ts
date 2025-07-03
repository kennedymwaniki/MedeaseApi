import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  //   run every 25 seconds
  @Cron('25 * * * * *')
  handleCronEvery2Seconds() {
    this.logger.debug('Called every 2 seconds');
  }

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
