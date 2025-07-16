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
import { DoctorTimeSlotService } from './doctor-time-slot.service';
import { CreateDoctorTimeSlotDto } from './dto/create-doctor-time-slot.dto';
import { UpdateDoctorTimeSlotDto } from './dto/update-doctor-time-slot.dto';
import { Public } from 'src/auth/decorators/public.decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/RoleGuard';

@UseGuards(RolesGuard)
@ApiTags('doctor-time-slot')
@Controller('doctor-time-slot')
@ApiBearerAuth()
export class DoctorTimeSlotController {
  constructor(private readonly doctorTimeSlotService: DoctorTimeSlotService) {}

  @Post()
  @Public()
  create(@Body() createDoctorTimeSlotDto: CreateDoctorTimeSlotDto) {
    return this.doctorTimeSlotService.create(createDoctorTimeSlotDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.doctorTimeSlotService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.doctorTimeSlotService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  update(
    @Param('id') id: string,
    @Body() updateDoctorTimeSlotDto: UpdateDoctorTimeSlotDto,
  ) {
    return this.doctorTimeSlotService.update(+id, updateDoctorTimeSlotDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.doctorTimeSlotService.remove(+id);
  }
}
