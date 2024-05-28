import mongoose, { Connection, Model, Query } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { User as UserM, UserDocument } from './schemas/user.schemas';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  async getHashPassword(password: String) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExistEmail = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (isExistEmail) {
      throw new BadRequestException(
        `Email: ${createUserDto.email} đã tồn tại. Vui lòng kiểm tra lại`,
      );
    }
    const newUser = new this.userModel({
      ...createUserDto,
      password: await this.getHashPassword(createUserDto.password),
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    newUser.save();
    return {
      _id: newUser?._id,
      email: newUser?.email,
    };
  }
  async registerAuth(registerUserDto: RegisterUserDto) {
    const isExistEmail = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (isExistEmail) {
      throw new BadRequestException(
        `Email: ${registerUserDto.email} đã tồn tại. Vui lòng kiểm tra lại`,
      );
    }
    const register = await this.userModel.create({
      ...registerUserDto,
      password: await this.getHashPassword(registerUserDto.password),
      role: 'USER',
    });
    return register;
  }
  async IsValidPass(pass: string, hash: string) {
    const isMatch = await bcrypt.compare(pass, hash);
    return isMatch;
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // delete filter.limit;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result,
    };
    return this.userModel.find().exec();
  }
  async findOne(id): Promise<UserM | string> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('not found user');
    }
    return await this.userModel.findById(id).select('-password');
  }
  async findOneByUsername(username: string): Promise<UserM> {
    return this.userModel.findOne({ email: username });
  }
  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('not found user');
    }
    await this.userModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } },
    );
    return this.userModel.softDelete({ _id: id });
  }
  updateRefreshToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };
  findUserByToken = (refreshToken: string) => {
    return this.userModel.findOne({ refreshToken });
  };
}
