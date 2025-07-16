import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  // UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from 'src/auth/guards/RoleGuard';
// import { Roles } from 'src/auth/decorators/roles.decorators';
// import { UserRole } from 'src/users/enums/roleEnums';
import { Public } from 'src/auth/decorators/public.decorators';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/RoleGuard';
import { UserRole } from 'src/users/enums/roleEnums';
// import { UserRole } from 'src/users/enums/roleEnums';

@UseGuards(RolesGuard)
@ApiTags('doctors')
@Controller('doctors')
@ApiBearerAuth()
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Public()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  // @Roles(UserRole.ADMIN,)
  remove(@Param('id') id: number) {
    return this.doctorsService.remove(id);
  }

  @Get(':id/available-slots/:date')
  getAvailableTimeSlots(@Param('id') id: number, @Param('date') date: string) {
    return this.doctorsService.getAvailableTimeSlots(id, date);
  }

  @Get(':id/all-slots/:date')
  getAllTimeSlots(@Param('id') id: number, @Param('date') date: string) {
    return this.doctorsService.getAllTimeSlots(id, date);
  }

  @Post(':id/generate-slots/:date')
  generateTimeSlots(@Param('id') id: number, @Param('date') date: string) {
    return this.doctorsService.generateTimeSlots(id, date);
  }

  // release a time slot using appointment id
  @Post('release-slot/:appointmentId')
  releaseTimeSlot(@Param('appointmentId') appointmentId: number) {
    return this.doctorsService.releaseTimeSlot(appointmentId);
  }
}
