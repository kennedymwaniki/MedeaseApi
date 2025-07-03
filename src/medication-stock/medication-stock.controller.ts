import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MedicationStockService } from './medication-stock.service';
import { CreateMedicationStockDto } from './dto/create-medication-stock.dto';
import { UpdateMedicationStockDto } from './dto/update-medication-stock.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('medication-stock')
@Controller('medication-stock')
@ApiBearerAuth()
export class MedicationStockController {
  constructor(
    private readonly medicationStockService: MedicationStockService,
  ) {}

  @Post()
  create(@Body() createMedicationStockDto: CreateMedicationStockDto) {
    return this.medicationStockService.create(createMedicationStockDto);
  }

  @Get()
  findAll() {
    return this.medicationStockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.medicationStockService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMedicationStockDto: UpdateMedicationStockDto,
  ) {
    return this.medicationStockService.update(+id, updateMedicationStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.medicationStockService.remove(+id);
  }
}
