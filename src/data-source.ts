import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Item } from './items/entities/item.entity';
import { Invoice } from './invoices/entities/invoice.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'Invoices',
  synchronize: false,
  logging: false,
  entities: [User, Item, Invoice],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});
