import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { IUser } from 'src/users/users.interface';
// const isBeforeDate = require('../utils/date.util');
import { isBeforeDate } from '../utils/date.util';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  async create(createJobDto: CreateJobDto, user: IUser) {
    const isBefore = isBeforeDate(createJobDto.startDate, createJobDto.endDate);
    if (isBefore) {
      return await this.jobModel.create({ ...createJobDto, createdBy: user });
    }
    return 'startDate không thể lớn hơn endDate';
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (current - 1) * pageSize;
    let defaultLimit = pageSize ? pageSize : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.jobModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    return await this.jobModel.findOne({ _id: id });
  }

  async update(updateJobDto: UpdateJobDto, user: IUser) {
    return await this.jobModel.updateOne(
      { _id: updateJobDto._id },
      { ...updateJobDto, updatedBy: user },
    );
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.updateOne({ _id: id }, { updatedBy: user });
    return await this.jobModel.softDelete({ _id: id });
  }
}
