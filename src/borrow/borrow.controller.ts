import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.create(createBorrowDto);
  }

  @Get(':id')
  findAllById(@Param('id') id: string) {
    return this.borrowService.findAllById(id);
  }

  @Put(':id')
  returnBook(@Param('id') id: string) {
    return this.borrowService.returnBook(id);
  }
}
