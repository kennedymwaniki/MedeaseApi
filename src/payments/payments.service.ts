import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,

    private readonly patientsService: PatientsService,
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsRepository.update(id, updatePaymentDto);
  }

  async findByPatientId(patientId: number) {
    const patient = await this.patientsService.findOne(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return this.paymentsRepository.find({ where: { patient } });
  }
  remove(id: number) {
    return this.paymentsRepository.delete(id);
  }
}
