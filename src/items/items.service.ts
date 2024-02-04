import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    try {
      const newItem = this.itemRepository.create(createItemDto);
      return await this.itemRepository.save(newItem);
    } catch (error) {
      console.error('Error creating item:', error);
      throw new InternalServerErrorException('Failed to create item');
    }
  }

  async findAll(): Promise<Item[]> {
    try {
      return await this.itemRepository.find();
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new InternalServerErrorException('Failed to fetch items');
    }
  }

  async findOne(id: number): Promise<Item> {
    try {
      const item = await this.itemRepository.findOneBy({ id });
      if (!item) {
        throw new NotFoundException(`Item with ID "${id}" not found`);
      }
      return item;
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      if (error.status === 404) throw error;
      throw new InternalServerErrorException(
        `Failed to fetch item with ID "${id}"`,
      );
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    try {
      const item = await this.findOne(id);
      const updatedItem = this.itemRepository.merge(item, updateItemDto);
      return await this.itemRepository.save(updatedItem);
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw new InternalServerErrorException(
        `Failed to update item with ID "${id}"`,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.itemRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Item with ID "${id}" not found`);
      }
    } catch (error) {
      console.error(`Error removing item with ID ${id}:`, error);
      if (error.status === 404) throw error;
      throw new InternalServerErrorException(
        `Failed to remove item with ID "${id}"`,
      );
    }
  }
}
