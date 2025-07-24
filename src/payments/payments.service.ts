/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MpesaDto } from './dto/mpesaDto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { UsersService } from 'src/users/users.service';
import { PaymentStatus } from './paymentStatus';
@Injectable()
export class PaymentsService {
  url =
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; //sandbox
  // const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",  //live
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,

    @Inject(REQUEST)
    private readonly request: Request,

    private readonly patientsService: PatientsService,
    private readonly prescriptionsService: PrescriptionsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const patient = await this.patientsService.findOne(
      createPaymentDto.patientId,
    );
    if (!patient) {
      throw new BadRequestException('Patient not found');
    }
    const prescription = await this.prescriptionsService.findOne(
      createPaymentDto.prescriptionId,
    );
    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }

    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      patient,
      prescription,
    });
    console.log('Payments created successfully now to saving ....:', payment);
    return this.paymentsRepository.save(payment);
  }

  findAll() {
    return this.paymentsRepository.find({
      relations: {
        patient: true,
        prescription: true,
      },
    });
  }

  findOne(id: number) {
    return this.paymentsRepository.findOne({
      where: { id },
      relations: ['patient', 'prescription'],
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentsRepository.findOne({ where: { id } });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    return this.paymentsRepository.update(id, updatePaymentDto);
  }

  async findByPatientId(patientId: number) {
    const patient = await this.patientsService.findOne(patientId);
    if (!patient) {
      throw new BadRequestException('Patient not found');
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
      return { message: 'BadRequestException processing request' };
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
      throw new BadRequestException('Failed to get access token.');
    }
  }

  async paystackPush(email: string, amount: number, prescriptionId: number) {
    const PAYSTACKURL = 'https://api.paystack.co/transaction/initialize';
    const headers = {
      Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };

    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';

    const newUrl = new URL(this.request.url, baseUrl);

    // Get user by email to get patient ID
    const user = await this.usersService.findUserByEmail(email);
    if (!user || !user.patient) {
      throw new BadRequestException('Patient not found for this email');
    }

    const prescription =
      await this.prescriptionsService.findOne(prescriptionId);
    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }

    const data = {
      email: email,
      amount: amount * 100,
      currency: 'KES',
      callback_url: `${newUrl.origin}/payments/paystack-callback`,
      metadata: {
        prescriptionId: prescriptionId,
        patientId: user.patient.id,
        originalAmount: amount,
      },
    };

    try {
      const response = await axios.post(PAYSTACKURL, data, { headers });
      // console.log('Paystack response:', response.data);

      const paymentDto: CreatePaymentDto = {
        amount: amount,
        method: 'Paystack',
        status: PaymentStatus.PENDING,
        paymentDate: new Date(),
        transactionId: response.data.data.reference,
        patientId: user.patient.id,
        prescriptionId: prescriptionId,
      };

      await this.create(paymentDto);

      return {
        message: 'Payment initialized successfully',
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to initialize payment');
    }
  }

  async verifyPaystackTransaction(transactionId: string) {
    const PAYSTACKURL = `https://api.paystack.co/transaction/verify/${transactionId}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.get(PAYSTACKURL, { headers });

      return response.data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to verify Paystack transaction');
    }
  }

  async paystackCallback(body: { trxref: string; reference: string }) {
    console.log('Received callback body:', body);
    const trxref = body.trxref;
    console.log('Received trxref:', trxref);

    try {
      const verificationResponse = await this.verifyPaystackTransaction(trxref);

      if (
        verificationResponse.status &&
        verificationResponse.data.status === 'success'
      ) {
        const payment = await this.paymentsRepository.findOne({
          where: { transactionId: trxref },
          relations: ['prescription'],
        });

        if (!payment) {
          console.log('Payment record not found for transaction ID:', trxref);
          throw new BadRequestException('Payment record not found');
        }

        await this.paymentsRepository.update(payment.id, {
          status: PaymentStatus.COMPLETED,
          paymentDate: new Date(),
        });

        if (payment.prescription) {
          await this.prescriptionsService.update(payment.prescription.id, {
            isPaid: true,
          });
        }

        return {
          message: 'Payment successful',
          data: verificationResponse.data,
        };
      } else {
        const payment = await this.paymentsRepository.findOne({
          where: { transactionId: trxref },
        });

        if (payment) {
          await this.paymentsRepository.update(payment.id, {
            status: PaymentStatus.FAILED,
          });
        }

        return {
          message: 'Payment failed',
          data: verificationResponse,
        };
      }
    } catch (error) {
      console.log(error);

      try {
        const payment = await this.paymentsRepository.findOne({
          where: { transactionId: trxref },
        });

        if (payment) {
          await this.paymentsRepository.update(payment.id, {
            status: PaymentStatus.FAILED,
          });
        }
      } catch (updateError) {
        console.log('Error updating payment status:', updateError);
      }

      return {
        message: 'Error processing payment',
        error: error.message,
      };
    }
  }
}
