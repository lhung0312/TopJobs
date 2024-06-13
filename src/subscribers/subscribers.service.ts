import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    let isExist = await this.subscriberModel.findOne({
      email: user.email,
    });
    if (isExist) {
      throw new BadRequestException(
        `Email: ${createSubscriberDto.email} đã subscribe từ trước`,
      );
    }
    return await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: user,
    });
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const offset = (current - 1) * pageSize;
    const defaultLimit = pageSize ? pageSize : 10;
    const totalItems = await this.subscriberModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.subscriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  findOne(id: string) {
    return this.subscriberModel.findOne({ _id: id });
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    return await this.subscriberModel.updateOne(
      { email: updateSubscriberDto.email },
      { ...updateSubscriberDto, updatedBy: user },
      { upsert: true },
    );
  }

  async remove(id: string, user: IUser) {
    await this.subscriberModel.updateOne({ _id: id }, { updatedBy: user });
    return await this.subscriberModel.softDelete({ _id: id });
  }

  async getSkills(user: IUser) {
    return await this.subscriberModel.findOne(
      { email: user.email },
      { skills: 1 },
    );
  }
}
