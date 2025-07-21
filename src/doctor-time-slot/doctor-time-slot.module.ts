import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorTimeSlotService } from './doctor-time-slot.service';
import { DoctorTimeSlotController } from './doctor-time-slot.controller';
import { DoctorTimeSlot } from './entities/doctor-time-slot.entity';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  controllers: [DoctorTimeSlotController],
  providers: [DoctorTimeSlotService],
  exports: [DoctorTimeSlotService],
  imports: [
    forwardRef(() => DoctorsModule),
    TypeOrmModule.forFeature([DoctorTimeSlot]),
  ],
})
export class DoctorTimeSlotModule {}
