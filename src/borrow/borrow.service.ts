import { BadRequestException, ForbiddenException, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BookService } from 'src/book/book.service';
import { BookDocument } from 'src/book/mongo/book.mongo';
import { ErrorsEnum } from 'src/core/errors/errors.enum';
import { ArrayUtil } from 'src/core/utils/array.util';
import { TimeUtil } from 'src/core/utils/time.util';
import { UserType } from 'src/user/enum/user-type.enum';
import { UserDocument } from 'src/user/mongo/user.mongo';
import { UserService } from 'src/user/user.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { ReturnBorrowDto } from './dto/return-borrow.dto';
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

    if (!user) throw new NotFoundException(ErrorsEnum.USER_DOES_NOT_EXIST);

    const canBorrow = this.canBorrow(user);

    if (!canBorrow) {
      return;
    }

    const book = await this.bookService.findById(createBorrowDto.bookId);
    if (!book) throw new NotFoundException(ErrorsEnum.BOOK_DOES_NOT_EXIST);

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

  canBorrow(user: UserDocument): boolean {
    if(user.type === UserType.GUEST) throw new ForbiddenException(ErrorsEnum.GUEST_ARE_NOT_ALLOWED_TO_BORROW);

    let hasTooMuchActiveBorrows = this.hasTooMuchActiveBorrows(user);

    if (hasTooMuchActiveBorrows) {
      throw new BadRequestException(ErrorsEnum.BORROW_LIMIT_EXCEED);
    }

    const hasALockingBorrow = this.isABorrowLocking(user);

    if (hasALockingBorrow) {
      throw new BadRequestException(ErrorsEnum.BORROW_TIME_EXCEED);
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

    if (unreturnedBooksBorrows.length > 0) throw new BadRequestException(ErrorsEnum.ALREADY_BORROWED);
    return true;
  }

  async findAllByBookId(bookId: ObjectId) {
    return await this.borrowModel.find({ book: bookId });
  }

  async findAllByUserId(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException(ErrorsEnum.USER_DOES_NOT_EXIST);
    return user.borrows;
  }

  async returnBook(returnBorrowedDto: ReturnBorrowDto) {

    const user = await this.userService.findById(returnBorrowedDto.borrower);

    if (!user) throw new NotFoundException(ErrorsEnum.USER_DOES_NOT_EXIST);

    const book = await this.bookService.findById(returnBorrowedDto.bookId);

    if (!book) throw new NotFoundException(ErrorsEnum.BOOK_DOES_NOT_EXIST);

    const isBoworred = this.isBorrowed(book);

    if (!isBoworred) throw new BadRequestException(ErrorsEnum.BOOK_NOT_BORROWED);

    const hasBook = await this.hasBook(user, book);

    if (!hasBook) throw new BadRequestException(ErrorsEnum.USER_IS_NOT_BORROWER);

    return this.processReturnBook(user, book);
  }

  async isBorrowed(book: BookDocument) {

    const bookBorrows = await this.findAllByBookId(book._id)
    return bookBorrows.filter(borrow => !borrow.returned).length > 0;
  }

  async hasBook(user: UserDocument, book: BookDocument) {
    const bookBorrow = await this.findAllByBookId(book._id);
    const bookUnreturnedBorrows = bookBorrow.filter(borrow => !borrow.returned);
    const userBorrows = user.borrows;

    return ArrayUtil.hasTwoArrayAnyMatchingValues<string>(bookUnreturnedBorrows.map(borrow => borrow.id), userBorrows as any[]);
  }

  async getUnreturnedBorrow(book: BookDocument) {
    const borrows = await this.borrowModel.find({ book: book });
    return borrows.filter(borrow => !borrow.returned)[0];
  }

  async processReturnBook(user: UserDocument, book: BookDocument) {

    const unreturnedBorrow = await this.getUnreturnedBorrow(book);
    unreturnedBorrow.returned = true;
    unreturnedBorrow.save();

    return unreturnedBorrow;
  }
}
