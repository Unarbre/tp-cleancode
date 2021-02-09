import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorsEnum } from 'src/core/errors/errors.enum';
import { MongoUtil } from 'src/core/utils/mongo.util';
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

  async findAll(): Promise<Book[]> {
    return this.bookModel.find();
  }

  async findById(id: string) {
    if (!MongoUtil.isValidObjectId(id)) throw new BadRequestException(ErrorsEnum.INVALID_ID);
    return await this.bookModel.findById(id);
  }
}
