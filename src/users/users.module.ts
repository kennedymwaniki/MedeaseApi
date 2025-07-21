import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { MailModule } from 'src/mail/mail.module';
import { DoctorsModule } from './../doctors/doctors.module';
import { PatientsModule } from './../patients/patients.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService],
  imports: [
    MailModule,
    forwardRef(() => PatientsModule),
    forwardRef(() => DoctorsModule),
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {}
