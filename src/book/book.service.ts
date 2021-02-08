import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoUtil } from 'src/core/utils/mongo.util';
import { UserService } from 'src/user/user.service';
import { BookDtoAdapter } from './adapter/book-dto.adapter';
import { CreateBookDto } from './dto/create-book.dto';
import { Book, BookDocument } from './mongo/book.mongo';

@Injectable()
export class BookService {

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private readonly bookDtoAdapter: BookDtoAdapter,
    private readonly userService: UserService,
  ) { }

  async create(createBookDto: CreateBookDto) {
    const bookEntity = this.bookDtoAdapter.adapt(createBookDto);
    return await this.bookModel.create(bookEntity);
  }

  async borrowBook(bookId: string, borrowerId: string) {
    const user = this.userService.findById(borrowerId);
    


  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find();
  }
}
