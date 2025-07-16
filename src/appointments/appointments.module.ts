import { DoctorsModule } from './../doctors/doctors.module';
import { PatientsModule } from './../patients/patients.module';
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { ZoomService } from 'src/zoom/zoomService';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, ZoomService],
  imports: [
    PatientsModule,
    DoctorsModule,
    TypeOrmModule.forFeature([Appointment]),
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
