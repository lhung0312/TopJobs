import mongoose, { Connection } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: IUser,
  ): Promise<Company> {
    const createdCompany = new this.companyModel({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return createdCompany.save();
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // delete filter.pageSize;
    let offset = (current - 1) * pageSize;
    let defaultpageSize = pageSize ? pageSize : 10;
    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultpageSize);
    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultpageSize)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result,
    };
  }

  async findOne(id: string): Promise<Company | string> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    const company = await this.companyModel.findById(id).exec();
    return company || 'not found company';
  }

  async update(updateCompanyDto: UpdateCompanyDto, id: string, user: IUser) {
    return this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }
  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    await this.companyModel.findByIdAndUpdate(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    const result = this.companyModel.softDelete({ _id: id });
    return result;
  }
}
