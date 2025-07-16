import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PrescriptionsModule } from 'src/prescriptions/prescriptions.module';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    PrescriptionsModule,
    PatientsModule,
    TypeOrmModule.forFeature([Payment]),
  ], // Add Payment entity here when created
})
export class PaymentsModule {}
