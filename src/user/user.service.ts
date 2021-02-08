import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDtoAdapter } from './adapter/user-dto.adapter';
import { CreateUserDto } from './dto/create-user.dto';
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

  async findById(userId: string): Promise<User> {
    return await this.userModel.findById(userId);
  }
}
