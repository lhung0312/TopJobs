import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    let isExist = await this.permissionModel.find({ apiPath, method });
    if (isExist) {
      throw new BadRequestException('permission existed');
    }
    let newPermission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: { _id: user._id, email: user.email },
    });
    return { _id: newPermission._id, name: newPermission.name };
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    // delete filter.pageSize;
    let offset = (current - 1) * pageSize;
    let defaultPageSize = pageSize ? pageSize : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultPageSize);
    const result = await this.permissionModel
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
    let permission = await this.permissionModel.findOne({ _id: id });
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
    user: IUser,
  ) {
    return await this.permissionModel.updateOne(
      { _id: id },
      {
        ...updatePermissionDto,
        updatedBy: { _id: user._id, email: user.email },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    await this.permissionModel.findByIdAndUpdate(
      { _id: id },
      {
        deleteBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.permissionModel.softDelete({ _id: id });
  }
}
