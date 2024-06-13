import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  status: string; // PENDING-REVIEWING-APPROVED-REJECTED

  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId()
  jobId: string;
}
export class CreateUserCvDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId()
  companyId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsMongoId()
  jobId: string;
}
