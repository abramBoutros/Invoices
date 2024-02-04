import { IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
