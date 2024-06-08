import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsArray,
  IsString,
  IsDate,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  name: string;

  @IsNotEmpty()
  @IsArray({ message: 'permissions phải có định dạng Array' })
  @IsMongoId({
    each: true,
    message: 'phần tử permissions phải có định dạng ObjectId',
  })
  permissions: mongoose.Schema.Types.ObjectId[];
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  isActive: boolean;
}
