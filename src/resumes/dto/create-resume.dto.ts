import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsArray,
  IsObject,
  ValidateNested,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateResumeDto {
  @IsNotEmpty({ message: 'email không được bỏ trống' })
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  status: string; // PENDING-REVIEWING-APPROVED-REJECTED

  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @IsMongoId()
  jobId: string;
}
export class CreateUserCvDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @IsMongoId()
  jobId: string;
}
