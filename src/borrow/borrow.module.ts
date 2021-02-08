import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrow, BorrowSchema } from './mongo/borrow.mongo';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/mongo/user.mongo';
import { UserDtoAdapter } from 'src/user/adapter/user-dto.adapter';
import { BookService } from 'src/book/book.service';
import { Book, BookSchema } from 'src/book/mongo/book.mongo';
import { BookDtoAdapter } from 'src/book/adapter/book-dto.adapter';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Borrow.name, schema: BorrowSchema },
    { name: User.name, schema: UserSchema },
    { name: Book.name, schema: BookSchema }]
  )],
  controllers: [BorrowController],
  providers: [BorrowService, UserService, UserDtoAdapter, BookService, BookDtoAdapter]
})
export class BorrowModule { }
