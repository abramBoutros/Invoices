import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

import { User } from './entities/user.entity'; // Adjust the path as necessary
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email is already in use');
      }

      const pepper = this.configService.get<string>('PEPPER');
      const passwordWithPepper = createUserDto.password + pepper;
      const hashedPassword = await bcrypt.hash(passwordWithPepper, 10);
      const userData = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(userData); // Save the user to the database
      if (!savedUser) throw new Error('Error creating user');

      return 'user created successfully';
    } catch (error) {
      console.error('Error validating user:', error);
      throw error; // Rethrow or handle as needed
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Email does not exist.');
      }
      const pepper = this.configService.get<string>('PEPPER');
      const isValid = await bcrypt.compare(password + pepper, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Password is incorrect.');
      }
      const { password: userPassword, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error validating user:', error);
      throw error; // Rethrow or handle as needed
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (error) {
      console.error('Error validating user:', error);
      throw error; // Rethrow or handle as needed
    }
  }
}
