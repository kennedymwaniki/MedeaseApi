import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AppointmentsModule } from 'src/appointments/appointments.module';
// import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
  imports: [AppointmentsModule],
})
export class TasksModule {}
