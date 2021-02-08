import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException } from '@nestjs/common';
import { MongoUtil } from 'src/core/utils/mongo.util';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  borrow(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.borrow(createBorrowDto);
  }

  @Get(':id')
  findAllById(@Param('id') id: string) {
    if(!MongoUtil.isValidObjectId(id)) throw new BadRequestException('Id is not valid');
    return this.borrowService.findAllById(id);
  }

  @Put(':id')
  returnBook(@Param('id') id: string) {
    return this.borrowService.returnBook(id);
  }
}
