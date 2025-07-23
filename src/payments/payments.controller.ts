import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  // UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/users/enums/roleEnums';
// import { AccessTokenGuard } from 'src/auth/guards/AccessTokenGuard';
import { MpesaDto } from './dto/mpesaDto';
import { Public } from 'src/auth/decorators/public.decorators';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

// @UseGuards(AccessTokenGuard)
@ApiBearerAuth()
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('/stk-push')
  @Public()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  stkPush(@Body() mpesaDto: MpesaDto) {
    return this.paymentsService.stkPush(mpesaDto);
  }

  @Post('/paystack-push')
  @Public()
  paystackPush(@Body() paystackDto: { email: string; amount: number }) {
    return this.paymentsService.paystackPush(
      paystackDto.email,
      paystackDto.amount,
    );
  }

  @Get('/paystack-callback')
  @Public()
  async paystackCallback(
    @Query() body: { trxref: string; reference: string },
    @Res() res: Response,
  ) {
    await this.paymentsService.paystackCallback(body);
    res.redirect(`${this.configService.get('FRONTEND_URL')}/payments/success`);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
