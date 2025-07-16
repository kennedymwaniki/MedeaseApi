import { PartialType } from '@nestjs/swagger';
import { CreateDoctorTimeSlotDto } from './create-doctor-time-slot.dto';

export class UpdateDoctorTimeSlotDto extends PartialType(
  CreateDoctorTimeSlotDto,
) {}
