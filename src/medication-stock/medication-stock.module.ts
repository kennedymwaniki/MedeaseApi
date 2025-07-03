import { MedicationsModule } from './../medications/medications.module';
import { Module } from '@nestjs/common';
import { MedicationStockService } from './medication-stock.service';
import { MedicationStockController } from './medication-stock.controller';
// import { MedicalHistory } from 'src/medical-history/entities/medical-history.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { MedicationStock } from './entities/medication-stock.entity';

@Module({
  controllers: [MedicationStockController],
  providers: [MedicationStockService],
  imports: [MedicationsModule, TypeOrmModule.forFeature([MedicationStock])],
})
export class MedicationStockModule {}
