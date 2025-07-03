import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from './../users/users.module';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [PatientsController],
  exports: [PatientsService],
  providers: [PatientsService],
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Patient])],
})
export class PatientsModule {}
