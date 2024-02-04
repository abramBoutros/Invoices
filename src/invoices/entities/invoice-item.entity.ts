// invoice-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Item } from '../../items/entities/item.entity'; // Adjust import path as necessary

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: number;

  @Column()
  invoiceId: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerUnit: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
