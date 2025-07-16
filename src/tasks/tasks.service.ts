import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class TasksService {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  private readonly logger = new Logger(TasksService.name);

  // run every 20 seconds
  // @Cron('*/20 * * * * *')
  // handleCronEvery20Seconds() {
  //   this.logger.debug('Called every 20 seconds');
  // }

  @Cron('0 8 * * *')
  async handleCronEveryDayAt8AM() {
    this.logger.debug('Checking appointments for today at 8 AM');
    try {
      const appointments =
        await this.appointmentsService.getAppointmentsForToday();
      this.logger.debug(`Found ${appointments.length} appointments for today`);
    } catch (error) {
      this.logger.error('Error checking appointments for today', error);
    }
  }
}
