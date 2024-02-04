import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  // TODO: @UseGuards(JwtAuthGuard)
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req) {
    const res = await this.invoicesService.create(
      createInvoiceDto,
      createInvoiceDto.userId,
    );
    return res;
  }

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateInvoiceDto: UpdateInvoiceDto,
  //   @Request() req,
  // ) {
  //   return this.invoicesService.update(+id, updateInvoiceDto, req.user.id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, @Request() req) {
  //   return this.invoicesService.remove(+id, req.user.id);
  // }
}
