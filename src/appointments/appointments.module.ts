import { DoctorsModule } from './../doctors/doctors.module';
import { PatientsModule } from './../patients/patients.module';
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [
    PatientsModule,
    DoctorsModule,

    TypeOrmModule.forFeature([Appointment]),
  ],
})
export class AppointmentsModule {}
