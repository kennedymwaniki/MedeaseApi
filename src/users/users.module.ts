import { forwardRef, Module } from '@nestjs/common';
import { DoctorsModule } from './../doctors/doctors.module';
import { PatientsModule } from './../patients/patients.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService],
  imports: [
    forwardRef(() => PatientsModule),
    forwardRef(() => DoctorsModule),
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {}
