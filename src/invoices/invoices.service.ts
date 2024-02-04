import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(
    createInvoiceDto: CreateInvoiceDto,
    userId: number,
  ): Promise<Invoice> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
      }

      let totalPrice = 0;

      for (const itemDto of createInvoiceDto.items) {
        const item = await this.itemRepository.findOne({
          where: { id: itemDto.itemId },
        });

        if (!item) {
          throw new NotFoundException(
            `Item with ID "${itemDto.itemId}" not found`,
          );
        }

        totalPrice += item.price * itemDto.quantity;
      }

      const invoice = this.invoiceRepository.create({
        totalPrice: totalPrice,
        user: user,
        status: 'PENDING',
      });

      const savedInvoice = await this.invoiceRepository.save(invoice);

      for (const itemDto of createInvoiceDto.items) {
        const item = await this.itemRepository.findOne({
          where: { id: itemDto.itemId },
        });

        const invoiceItem = this.invoiceItemRepository.create({
          itemId: item.id,
          invoiceId: savedInvoice.id,
          quantity: itemDto.quantity,
          pricePerUnit: item.price,
        });

        await this.invoiceItemRepository.save(invoiceItem);
      }

      return savedInvoice;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Invoice[]> {
    try {
      const invoices = await this.invoiceRepository.find({
        where: {},
      });
      return invoices;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { id },
      });
      if (!invoice) {
        throw new NotFoundException(`Invoice with ID "${id}" not found`);
      }
      const invoiceItems = await this.invoiceItemRepository.find({
        where: { invoiceId: id },
      });
      return { invoice, invoiceItems };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  // async update(
  //   id: number,
  //   updateInvoiceDto: UpdateInvoiceDto,
  //   userId: number,
  // ): Promise<Invoice> {
  //   try {
  //     const invoice = await this.findOne(id, userId);
  //     const updatedInvoice = this.invoiceRepository.merge(
  //       invoice,
  //       // updateInvoiceDto,
  //     );
  //     return await this.invoiceRepository.save(updatedInvoice);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async remove(id: number, userId: number): Promise<void> {
  //   try {
  //     const invoice = await this.findOne(id, userId);
  //     await this.invoiceRepository.remove(invoice);
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
