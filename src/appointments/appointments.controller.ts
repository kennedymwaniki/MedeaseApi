import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { RolesGuard } from 'src/auth/guards/RoleGuard';
// import { UserRole } from 'src/users/enums/roleEnums';
// import { Roles } from 'src/auth/decorators/roles.decorators';

// @UseGuards(RolesGuard)
@ApiTags('appointments')
@Controller('appointments')
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  // @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  // @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('today')
  // @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  findTodayAppointments() {
    return this.appointmentsService.getAppointmentsForToday();
  }

  @Get(':id')
  // @Roles(UserRole.ADMIN, UserRole.PATIENT)
  findOne(@Param('id') id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  // @Roles(UserRole.ADMIN, UserRole.PATIENT)
  update(
    @Param('id') id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  // @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  remove(@Param('id') id: number) {
    return this.appointmentsService.remove(id);
  }
}
