import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsIn } from 'class-validator';
import { User } from '../../users/entities/user.entity';

// I will use POJO in the future XD
export const InvoiceStatuses = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
};

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @IsIn([
    InvoiceStatuses.PENDING,
    InvoiceStatuses.PAID,
    InvoiceStatuses.CANCELLED,
  ])
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
