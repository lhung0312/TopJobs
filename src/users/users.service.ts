import mongoose, { Connection, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
  ) {}

  async getHashPassword(password: String) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel({
      ...createUserDto,
      password: await this.getHashPassword(createUserDto.password),
    });
    return createdUser.save();
  }
  async IsValidPass(pass: string, hash: string) {
    const isMatch = await bcrypt.compare(pass, hash);
    return isMatch;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id): Promise<User> {
    return this.userModel.findById(id).exec();
  }
  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ email: username });
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
