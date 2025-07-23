import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsModule } from 'src/patients/patients.module';
import { PrescriptionsModule } from 'src/prescriptions/prescriptions.module';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    PrescriptionsModule,
    PatientsModule,
    TypeOrmModule.forFeature([Payment]),
  ],
})
export class PaymentsModule {}
