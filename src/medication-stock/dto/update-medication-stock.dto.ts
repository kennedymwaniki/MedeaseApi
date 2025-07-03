import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationStockDto } from './create-medication-stock.dto';

export class UpdateMedicationStockDto extends PartialType(
  CreateMedicationStockDto,
) {}
