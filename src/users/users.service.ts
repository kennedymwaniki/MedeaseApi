import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new NotFoundException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );
    createUserDto.password = hashedPassword;

    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    await this.mailService.sendWelcomeUserEmail(savedUser);

    return savedUser;
  }

  findAll() {
    return this.userRepository.find({
      
    
      relations: ['patient', 'doctor'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select:{
        id: true,
        email: true,
        role: true,
        otp: true,
        secret: true,
        firstname: true,
        hashedRefreshToken: true,
        doctor:true,  
        patient:true,
      },
      relations: ['patient', 'doctor'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // check if a new password is provided
    if (updateUserDto.password) {
      const saltRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
      await this.userRepository.update(id, updateUserDto).then(() => {
        return this.userRepository.findOneBy({ id });
      });
    }

    return this.userRepository.update(id, updateUserDto).then(async () => {
      const updatedUser = await this.userRepository.findOneBy({ id });
      if (!updatedUser) {
        throw new NotFoundException(
          `User with ID ${id} not found after update`,
        );
      }
      return updatedUser;
    });
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  public async findUserByEmail(email: string) {
    const User = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!User) {
      console.log('User not found');
      throw new BadRequestException(`A user with such an email does not exist`);
    }
    console.log(`User with email ${email} found`);
    return User;
  }

  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }

  public async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
