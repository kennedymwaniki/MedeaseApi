import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from './../users/users.module';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorTimeSlot } from 'src/doctor-time-slot/entities/doctor-time-slot.entity';

@Module({
  controllers: [DoctorsController],
  exports: [DoctorsService],
  providers: [DoctorsService],
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([Doctor, DoctorTimeSlot]),
  ],
})
export class DoctorsModule {}
