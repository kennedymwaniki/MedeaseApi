import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMedicationStockDto } from './dto/create-medication-stock.dto';
import { UpdateMedicationStockDto } from './dto/update-medication-stock.dto';
import { MedicationStock } from './entities/medication-stock.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { MedicationsService } from 'src/medications/medications.service';

@Injectable()
export class MedicationStockService {
  constructor(
    @InjectRepository(MedicationStock)
    private readonly medicationStockRepository: Repository<MedicationStock>,
    private readonly medicationsService: MedicationsService,
  ) {}

  async create(createMedicationStockDto: CreateMedicationStockDto) {
    const medication = await this.medicationsService.findOne(
      createMedicationStockDto.medicationId,
    );
    if (!medication) {
      throw new BadRequestException('Medication not found');
    }
    const medicationStock = this.medicationStockRepository.create({
      ...createMedicationStockDto,
      medication,
    });
    return this.medicationStockRepository.save(medicationStock);
  }

  findAll() {
    return this.medicationStockRepository.find({
      relations: ['medication'],
    });
  }

  findOne(id: number) {
    return this.medicationStockRepository.findOne({
      where: { id },
      relations: ['medication'],
    });
  }

  update(id: number, updateMedicationStockDto: UpdateMedicationStockDto) {
    return this.medicationStockRepository.update(id, updateMedicationStockDto);
  }

  remove(id: number) {
    return this.medicationStockRepository.delete(id);
  }
}
