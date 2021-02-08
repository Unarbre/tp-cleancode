import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { BorrowDtoAdapter } from './adapter/borrow-dto.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Borrow, BorrowSchema } from './mongo/borrow.mongo';
import { UserService } from 'src/user/user.service';
import { User, UserSchema } from 'src/user/mongo/user.mongo';
import { UserDtoAdapter } from 'src/user/adapter/user-dto.adapter';

@Module({
  imports: [MongooseModule.forFeature([{ name: Borrow.name, schema: BorrowSchema }, { name: User.name, schema: UserSchema }])],
  controllers: [BorrowController],
  providers: [BorrowService, BorrowDtoAdapter, UserService, UserDtoAdapter]
})
export class BorrowModule { }
