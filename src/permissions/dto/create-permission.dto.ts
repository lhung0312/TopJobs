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

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  method: string;
  @IsNotEmpty()
  @ApiProperty()
  apiPath: string;
  @IsNotEmpty()
  @ApiProperty()
  module: string;
}
