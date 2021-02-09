import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BorrowDocument } from 'src/borrow/mongo/borrow.mongo';
import { ErrorsEnum } from 'src/core/errors/errors.enum';
import { MongoUtil } from 'src/core/utils/mongo.util';
import { UserDtoAdapter } from './adapter/user-dto.adapter';
import { CreateUserDto } from './dto/create-user.dto';
import { UserType } from './enum/user-type.enum';
import { User, UserDocument } from './mongo/user.mongo';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userDtoAdapter: UserDtoAdapter,
  ) { }


  async create(createUserDto: CreateUserDto) {
    const userEntity = this.userDtoAdapter.adapt(createUserDto);
    return await this.userModel.create(userEntity);
  }

  async findById(id: string) {
    if (!MongoUtil.isValidObjectId(id)) throw new BadRequestException(ErrorsEnum.INVALID_ID);
    return await this.userModel.findById(id);
  }

  async getType(id: string): Promise<UserType> {
    if (!MongoUtil.isValidObjectId(id)) throw new BadRequestException(ErrorsEnum.INVALID_ID);

    const user = await this.findById(id);

    if (!user) return null;

    return user.type;
  }

  async addBorrow(borrow: BorrowDocument, user: UserDocument) {

    user.borrows.push(borrow);

    user.save();

    return user;
  }

  async findAll() {
    return this.userModel.find();
  }
}
