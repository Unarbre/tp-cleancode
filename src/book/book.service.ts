import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookDtoAdapter } from './adapter/book-dto.adapter';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './mongo/book.mongo';

@Injectable()
export class BookService {

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private readonly bookDtoAdapter: BookDtoAdapter,
  ) { }

  async create(createBookDto: CreateBookDto) {
    const bookEntity = this.bookDtoAdapter.adapt(createBookDto);
    return await this.bookModel.create(bookEntity);
  }
}
