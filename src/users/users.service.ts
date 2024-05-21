import mongoose, { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // const bcrypt = require('bcrypt');
    // const saltRounds = 10;
    // const myPlaintextPassword = 's0//P4$$w0rD';
    // const someOtherPlaintextPassword = 'not_bacon';

    // bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
    //   // Store hash in your password DB.
    // });

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async update(updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    return this.userModel.deleteOne({ _id: id }).exec();
  }
}
