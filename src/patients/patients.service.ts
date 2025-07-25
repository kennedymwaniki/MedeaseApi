import {
  BadRequestException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/enums/roleEnums';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const user = await this.userService.findOne(createPatientDto.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.role !== UserRole.PATIENT) {
      throw new BadRequestException('User is not a patient');
    }
    const patient = this.patientRepository.create({
      ...createPatientDto,
      user,
    });

    return this.patientRepository.save(patient);
  }

  findAll() {
    return this.patientRepository.find({
      relations: {
        user: true,
      },
    });
  }

  findOne(id: number) {
    return this.patientRepository.findOne({
      where: { id },
      relations: {
        user: true,
        appointments: true,
        medicalHistories: true,
        prescriptions: {
          doctor: {
            user: true,
          },
          medication: true,
        },
        payments: true,
      },
    });
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    return this.patientRepository.update(id, updatePatientDto);
  }

  remove(id: number) {
    return this.patientRepository.delete(id);
  }
}
