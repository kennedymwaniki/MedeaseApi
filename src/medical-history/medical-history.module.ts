import { Module } from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { MedicalHistoryController } from './medical-history.controller';
import { MedicalHistory } from './entities/medical-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [MedicalHistoryController],
  providers: [MedicalHistoryService],
  imports: [TypeOrmModule.forFeature([MedicalHistory])],
})
export class MedicalHistoryModule {}
