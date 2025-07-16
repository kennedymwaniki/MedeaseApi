import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: Repository<Chat>) {}
  create(createChatDto: CreateChatDto) {
    return this.chatRepository.save(createChatDto);
  }

  findAll() {
    return this.chatRepository.find();
  }

  findOne(id: number) {
    return this.chatRepository.findOne({
      where: { id },
    });
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return this.chatRepository.update(id, updateChatDto);
  }

  remove(id: number) {
    return this.chatRepository.delete(id);
  }
}
