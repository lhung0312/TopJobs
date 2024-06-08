import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
    private configService: ConfigService,
  ) {}
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name } = createRoleDto;
    let isExist = await this.roleModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException("Role's name existed");
    }
    let newRole = await this.roleModel.create({
      ...createRoleDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return newRole;
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (current - 1) * pageSize;
    let defaultPageSize = pageSize ? pageSize : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultPageSize);
    const result = await this.roleModel
      .find(filter)
      .skip(offset)
      .limit(defaultPageSize)
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
    let role = await this.roleModel.findOne({ _id: id }).populate({
      path: 'permissions',
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 },
    });
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const roleAdmin = this.configService.get<string>('ROLE_ADMIN');
    const checkRole = await this.roleModel.findOne({ _id: id });
    if (checkRole.name === roleAdmin) {
      throw new BadRequestException('không thể xoá Role của Admin');
    }
    await this.roleModel.findByIdAndUpdate(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.roleModel.softDelete({ _id: id });
  }
}
