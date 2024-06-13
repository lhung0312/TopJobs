import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  @ApiProperty()
  _id: mongoose.Types.ObjectId;
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  name: String;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: String;

  @IsNotEmpty()
  @ApiProperty()
  password: String;

  @IsNotEmpty()
  @ApiProperty()
  age: number;

  @IsNotEmpty()
  @ApiProperty()
  gender: string;

  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @IsNotEmptyObject()
  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId({ message: 'role phải có định dạng ObjectID' })
  role: string;
}
export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty()
  name: String;

  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  email: String;

  @IsNotEmpty()
  @ApiProperty()
  password: String;

  @IsNotEmpty()
  @ApiProperty()
  age: number;

  @IsNotEmpty()
  @ApiProperty()
  gender: string;

  @IsNotEmpty()
  @ApiProperty()
  address: string;
}
