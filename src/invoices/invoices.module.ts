import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { User } from '../users/entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem, User, Item])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
