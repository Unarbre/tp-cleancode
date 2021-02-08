import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { BorrowDtoAdapter } from './adapter/borrow-dto.adapter';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { Borrow, BorrowDocument } from './mongo/borrow.mongo';

@Injectable()
export class BorrowService {
  constructor(
    @InjectModel(Borrow.name) private borrowModel: Model<BorrowDocument>,
    private readonly borrowDtoAdapter: BorrowDtoAdapter,
    private readonly userService: UserService,
  ) { }

  async create(createBorrowDto: CreateBorrowDto) {
    const borrowEntity = this.borrowDtoAdapter.adapt(createBorrowDto);
    const borrow = await this.borrowModel.create(borrowEntity);
    const user = await this.userService.findById(createBorrowDto.borrower);
    user.borrows.push(borrow);
    user.save();

  }

  findAllById(id: string) {
    return `This action returns all borrow`;
  }

  returnBook(id: string) {
    return `This action updates a #${id} borrow`;
  }
}
