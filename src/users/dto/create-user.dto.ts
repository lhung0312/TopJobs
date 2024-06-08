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
  _id: mongoose.Types.ObjectId;
  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  name: String;
  @IsEmail()
  @IsNotEmpty()
  email: String;
  @IsNotEmpty()
  password: String;
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
  @IsNotEmpty()
  @IsMongoId({ message: 'role phải có định dạng ObjectID' })
  role: string;
}
export class RegisterUserDto {
  @IsNotEmpty()
  name: String;
  @IsEmail()
  @IsNotEmpty()
  email: String;
  @IsNotEmpty()
  password: String;
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  address: string;
}
