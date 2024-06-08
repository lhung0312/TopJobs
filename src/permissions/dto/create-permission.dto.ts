import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsArray,
  IsString,
  IsDate,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  name: string;
  @IsNotEmpty()
  method: string;
  @IsNotEmpty()
  apiPath: string;
  @IsNotEmpty()
  module: string;
}
