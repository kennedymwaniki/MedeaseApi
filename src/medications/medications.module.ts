import { Module } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { MedicationsController } from './medications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medication.entity';

@Module({
  controllers: [MedicationsController],
  exports: [MedicationsService],
  providers: [MedicationsService],
  imports: [TypeOrmModule.forFeature([Medication])],
})
export class MedicationsModule {}
