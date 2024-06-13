import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsArray, IsString, IsDate } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsArray({ message: 'skills phải có định dạng Array' })
  @IsString({ each: true, message: 'phần tử skills phải có định dạng String' })
  skills: string[];

  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsNotEmpty()
  @ApiProperty()
  company: {
    _id: string;
    name: string;
    logo: string;
  };

  @IsNotEmpty()
  @ApiProperty()
  salary: number;

  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsNotEmpty()
  @ApiProperty()
  level: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate phải có định dạng Date' })
  startDate: Date;

  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'endDate phải có định dạng Date' })
  endDate: Date;

  @ApiProperty()
  isActive: boolean;
}
