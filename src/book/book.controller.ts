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

  @Post('/borrow/:bookId/:borrowerId')
  borrow(@Param('bookId') bookId: string, @Param('borrowerId') borrowerId: string) {
    const areIdsValid = MongoUtil.isValidObjectId(bookId) && MongoUtil.isValidObjectId(borrowerId);
    
    if (!areIdsValid) {
      throw new BadRequestException('Passed ids are not valid');
    }

    return this.bookService.borrowBook(bookId, borrowerId);
  }

  @Get('')
  seeAllbooks() {
    return this.bookService.findAll();
  }
}
