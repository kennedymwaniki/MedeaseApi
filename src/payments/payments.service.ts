/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MpesaDto } from './dto/mpesaDto';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaymentsService {
  url =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; //sandbox
  // const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",  //live
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,

    private readonly patientsService: PatientsService,
    private readonly configService: ConfigService,
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

  async stkPush(MpesaDto: MpesaDto) {
    const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';
    const token = await this.generateToken();

    const phoneNumber = MpesaDto.phoneNumber;
    const amount = MpesaDto.amount;
    try {
      const date = new Date();
      const timestamp =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const password = Buffer.from(
        this.configService.get('MPESA_SHORTCODE') +
          this.configService.get('MPESA_PASSKEY') +
          timestamp,
      ).toString('base64');

      const formattedPhone = `254${phoneNumber.slice(-9)}`;

      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.configService.get('MPESA_SHORTCODE'), // store number for tills
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline', //CustomerBuyGoodsOnline - for till
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: this.configService.get('MPESA_SHORTCODE'),
          PhoneNumber: formattedPhone,
          CallBackURL: 'https://fhms.onrender.com/api/callback-url-path',
          AccountReference: formattedPhone,
          TransactionDesc: 'anything here',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return {
        message: `stk sent successfully to ${formattedPhone}`,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return { message: 'Error processing request' };
    }
  }

  async generateToken() {
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
    try {
      const encodedCredentials = Buffer.from(
        consumerKey + ':' + consumerSecret,
      ).toString('base64');

      const headers = {
        Authorization: 'Basic' + ' ' + encodedCredentials,
        'Content-Type': 'application/json',
      };

      const response = await axios.get(this.url, { headers });
      console.log(
        'this is the reponse from the initial token request:',
        response.data,
      );
      console.log('Token generated successfully.');
      return response.data.access_token;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to get access token.');
    }
  }
}
