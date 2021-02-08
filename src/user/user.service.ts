import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async findById(id: string): Promise<User> {
    if (!MongoUtil.isValidObjectId(id)) return null;
    return await this.userModel.findById(id);
  }

  async getType(id: string): Promise<UserType> {
    if (!MongoUtil.isValidObjectId(id)) return null;

    const user = await this.findById(id);

    if (!user) return null;

    return user.type;
  }
}
