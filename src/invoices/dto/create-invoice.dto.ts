import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateInvoiceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsNumber()
  @IsPositive()
  userId: number;
}
