import { DoctorsModule } from './../doctors/doctors.module';
import { PatientsModule } from './../patients/patients.module';
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { ZoomService } from 'src/zoom/zoomService';
import { PushNotificationsModule } from 'src/push-notifications/push-notifications.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, ZoomService],
  imports: [
    PatientsModule,
    DoctorsModule,
    PushNotificationsModule,
    TypeOrmModule.forFeature([Appointment]),
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
