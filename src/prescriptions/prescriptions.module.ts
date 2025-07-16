import { PatientsModule } from './../patients/patients.module';
import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { Prescription } from './entities/prescription.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { MedicationsModule } from 'src/medications/medications.module';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  controllers: [PrescriptionsController],
  exports: [PrescriptionsService],
  providers: [PrescriptionsService],
  imports: [
    PatientsModule,
    MedicationsModule,
    DoctorsModule,
    TypeOrmModule.forFeature([Prescription]),
  ],
})
export class PrescriptionsModule {}
