import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeUtil } from 'src/core/utils/time.util';
import { UserDocument } from 'src/user/mongo/user.mongo';
import { UserService } from 'src/user/user.service';
import { BorrowDtoAdapter } from './adapter/borrow-dto.adapter';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Borrow, BorrowDocument } from './mongo/borrow.mongo';

@Injectable()
export class BorrowService {

  private BORROWS_LIMIT = 3;
  private LOCKING_BORROW_DATE = TimeUtil.getDate4monthsAgo()

  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
    private readonly borrowDtoAdapter: BorrowDtoAdapter,
    private readonly userService: UserService,
  ) { }

  async borrow(createBorrowDto: CreateBorrowDto) {
    const user = await this.userService.findById(createBorrowDto.borrower);

    if (!user) throw new NotFoundException('User does not exist');

    const canBorrow = this.canBorrow(user);

    if (!canBorrow) {
      return;
    }

    const borrowEntity = this.borrowDtoAdapter.adapt(createBorrowDto);

    const borrow = await this.borrowModel.create(borrowEntity);

    this.userService.addBorrow(borrow, user);

    return borrow;
  }

  async findAllById(id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User does not exist');
    return user.borrows;
  }

  returnBook(id: string) {
    return `This action updates a #${id} borrow`;
  }

  canBorrow(user: UserDocument): boolean {
    const borrows = user.borrows;

    const borrowsInProgress = borrows.filter(borrow => !borrow.returned);

    if (borrowsInProgress.length >= this.BORROWS_LIMIT) {
      throw new BadRequestException('Borrows limit exceeded');
    }

    const hasALockingBorrow = this.isABorrowLocking(borrows);

    if (hasALockingBorrow) {
      throw new BadRequestException('One of your books has been borrowed too long time ago');
    }

    return true;
  }

  isABorrowLocking(borrows: Borrow[]): boolean {

    for (const borrow of borrows) {
      const isLocking = (borrow.date < this.LOCKING_BORROW_DATE) && !borrow.returned;
      if (isLocking) return true;
    }

    return false;
  }
}
