import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './mongo/book.mongo';
import { BookDtoAdapter } from './adapter/book-dto.adapter';
import { UserService } from 'src/user/user.service';
import { UserSchema, User } from 'src/user/mongo/user.mongo';
import { UserDtoAdapter } from 'src/user/adapter/user-dto.adapter';

@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }, { name: User.name, schema: UserSchema }])],
  controllers: [BookController],
  providers: [BookService, BookDtoAdapter, UserService, UserDtoAdapter]
})
export class BookModule { }
