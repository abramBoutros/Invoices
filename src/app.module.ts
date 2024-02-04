import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { InvoicesModule } from './invoices/invoices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'Invoices',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // not for production
      // autoLoadEntities: true,
      // logging: true,
      // logger: 'file',
      keepConnectionAlive: true,
      retryAttempts: 10,
      retryDelay: 3000,
      timezone: '+00:00',
      connectTimeout: 10000,
      acquireTimeout: 10000,
      migrationsRun: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ItemsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
