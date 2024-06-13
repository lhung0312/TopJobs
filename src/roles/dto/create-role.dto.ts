import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsArray({ message: 'permissions phải có định dạng Array' })
  @ApiProperty()
  @IsMongoId({
    each: true,
    message: 'phần tử permissions phải có định dạng ObjectId',
  })
  permissions: mongoose.Schema.Types.ObjectId[];
  @IsNotEmpty()
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @ApiProperty()
  isActive: boolean;
}
