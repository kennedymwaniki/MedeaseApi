import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { MedicalHistory } from './entities/medical-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
  imports: [PatientsModule, TypeOrmModule.forFeature([MedicalHistory])],
})
export class MedicalHistoryModule {}
