import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from './../users/users.module';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DoctorsController],
  exports: [DoctorsService],
  providers: [DoctorsService],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Doctor])],
})
export class DoctorsModule {}
