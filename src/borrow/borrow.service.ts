import { Injectable } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@Injectable()
export class BorrowService {
  create(createBorrowDto: CreateBorrowDto) {
    return 'This action adds a new borrow';
  }

  findAllById(id: string) {
    return `This action returns all borrow`;
  }

  returnBook(id: string) {
    return `This action updates a #${id} borrow`;
  }
}
