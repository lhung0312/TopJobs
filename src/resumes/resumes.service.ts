import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name)
    private resumeModel: SoftDeleteModel<ResumeDocument>,
  ) {}
  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    try {
      let newCv = await this.resumeModel.create({
        ...createUserCvDto,
        email: user.email,
        userId: user._id,
        status: 'PENDING',
        history: [
          {
            status: 'PENDING',
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        ],
        createdBy: { _id: user._id, email: user.email },
      });
      return {
        _id: newCv?._id,
        createdAt: newCv?.createdAt,
      };
    } catch (error) {
      console.log('error:', error);
      throw new BadRequestException('false creation');
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (current - 1) * pageSize;
    let defaultLimit = pageSize ? pageSize : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found resume');
    }
    return await this.resumeModel.findById(id);
  }

  async update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found resume');
    }

    if (status) {
      let resume = await this.resumeModel.findOne({ _id: id });
      resume.history.push({
        status: status,
        updatedAt: new Date(),
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      });
      resume.save();
      return await this.resumeModel.updateOne(
        { _id: id },
        {
          status: status,
          updatedBy: { _id: user._id, email: user.email },
        },
      );
    }
    throw new BadRequestException('fill status, plz');
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found resume');
    }
    await this.resumeModel.updateOne(
      { _id: id },
      { deletedBy: { _id: user._id, email: user.email } },
    );
    await this.resumeModel.softDelete({ _id: id });
  }

  async findByUser(user: IUser) {
    return await this.resumeModel.find({
      createdBy: { _id: user._id, email: user.email },
    });
  }
}
