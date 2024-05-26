import { Type } from 'class-transformer';
import {
  IsEmail,
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
  role: string;
}
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: String;
  @IsNotEmpty()
  password: String;
  name: String;
}
