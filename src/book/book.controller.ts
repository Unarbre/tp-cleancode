import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Post('/borrow/:bookId/:borrowerId')
  borrow(@Param('bookId') bookId: string, @Param('borrowerId') borrowerId: string) {
    console.log(bookId);
    console.log(borrowerId);
  }
}
