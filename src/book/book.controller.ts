import { Controller, Get, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { MongoUtil } from 'src/core/utils/mongo.util';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post('')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get('')
  seeAllbooks() {
    return this.bookService.findAll();
  }
}
