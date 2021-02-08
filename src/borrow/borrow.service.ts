import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BookService } from 'src/book/book.service';
import { BookDocument } from 'src/book/mongo/book.mongo';
import { TimeUtil } from 'src/core/utils/time.util';
import { UserDocument } from 'src/user/mongo/user.mongo';
import { UserService } from 'src/user/user.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Borrow, BorrowDocument } from './mongo/borrow.mongo';

@Injectable()
export class BorrowService {

  private BORROWS_LIMIT = 3;
  private LOCKING_BORROW_DATE = TimeUtil.getDate4monthsAgo()

  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
    private readonly userService: UserService,
    private readonly bookService: BookService,
  ) { }

  async borrow(createBorrowDto: CreateBorrowDto) {
    const user = await this.userService.findById(createBorrowDto.borrower);

    if (!user) throw new NotFoundException('User does not exist');

    const canBorrow = this.canBorrow(user);

    if (!canBorrow) {
      return;
    }

    const book = await this.bookService.findById(createBorrowDto.bookId);
    if (!book) throw new NotFoundException('Book does not exist');

    const isFreeToBorrow = await this.isFreeToBorrow(book);

    if (!isFreeToBorrow) {
      return;
    }

    return this.processBorrow(user, book);
  }

  async processBorrow(user: UserDocument, book: BookDocument) {
    const borrowEntity = { book, date: new Date() };

    const borrow = await this.borrowModel.create(borrowEntity);

    this.userService.addBorrow(borrow, user);

    return borrow;
  }

  async findAllByUserId(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User does not exist');
    return user.borrows;
  }

  canBorrow(user: UserDocument): boolean {
    let hasTooMuchActiveBorrows = this.hasTooMuchActiveBorrows(user);


    if (hasTooMuchActiveBorrows) {
      throw new BadRequestException('Borrows limit exceeded');
    }

    const hasALockingBorrow = this.isABorrowLocking(user);

    if (hasALockingBorrow) {
      throw new BadRequestException('One of your books has been borrowed too long time ago');
    }

    return true;
  }

  hasTooMuchActiveBorrows(user: UserDocument) {
    const borrows = user.borrows;

    const borrowsInProgress = borrows.filter(borrow => !borrow.returned);

    if (borrowsInProgress.length >= this.BORROWS_LIMIT) return true;

    return false;
  }

  isABorrowLocking(user: UserDocument): boolean {
    const borrows = user.borrows;

    for (const borrow of borrows) {
      const isLocking = (borrow.date < this.LOCKING_BORROW_DATE) && !borrow.returned;
      if (isLocking) return true;
    }

    return false;
  }

  async isFreeToBorrow(book: BookDocument): Promise<boolean> {
    const booksBorrows = await this.findAllByBookId(book._id);
    const unreturnedBooksBorrows = booksBorrows.filter(borrow => !borrow.returned);
    console.log(unreturnedBooksBorrows);

    if (unreturnedBooksBorrows.length > 0) throw new BadRequestException('Book is already borrowed');
    return true;
  }

  async findAllByBookId(bookId: ObjectId) {
    return await this.borrowModel.find({ book: bookId });
  }

  returnBook(id: string) {
    return `This action updates a #${id} borrow`;
  }
}
