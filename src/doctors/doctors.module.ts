import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorTimeSlotModule } from 'src/doctor-time-slot/doctor-time-slot.module';
import { UsersModule } from './../users/users.module';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { DoctorTimeSlot } from 'src/doctor-time-slot/entities/doctor-time-slot.entity';

@Module({
  controllers: [DoctorsController],
  exports: [DoctorsService],
  providers: [DoctorsService],
  imports: [
    forwardRef(() => UsersModule),
    DoctorTimeSlotModule,
    TypeOrmModule.forFeature([Doctor, DoctorTimeSlot]),
  ],
})
export class DoctorsModule {}
