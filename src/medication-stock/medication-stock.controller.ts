import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MedicationStockService } from './medication-stock.service';
import { CreateMedicationStockDto } from './dto/create-medication-stock.dto';
import { UpdateMedicationStockDto } from './dto/update-medication-stock.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guards/AccessTokenGuard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { UserRole } from 'src/users/enums/roleEnums';

@UseGuards(AccessTokenGuard)
@ApiTags('medication-stock')
@Controller('medication-stock')
@ApiBearerAuth()
export class MedicationStockController {
  constructor(
    private readonly medicationStockService: MedicationStockService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  create(@Body() createMedicationStockDto: CreateMedicationStockDto) {
    return this.medicationStockService.create(createMedicationStockDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  findAll() {
    return this.medicationStockService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  findOne(@Param('id') id: number) {
    return this.medicationStockService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  update(
    @Param('id') id: number,
    @Body() updateMedicationStockDto: UpdateMedicationStockDto,
  ) {
    return this.medicationStockService.update(+id, updateMedicationStockDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  remove(@Param('id') id: number) {
    return this.medicationStockService.remove(+id);
  }
}
