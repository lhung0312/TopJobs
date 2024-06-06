import { Transform } from 'class-transformer';
import { IsNotEmpty, IsArray, IsString, IsDate } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  name: string;

  @IsNotEmpty()
  @IsArray({ message: 'skills phải có định dạng Array' })
  @IsString({ each: true, message: 'phần tử skills phải có định dạng String' })
  skills: string[];

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  company: {
    _id: string;
    name: string;
    logo: string;
  };

  @IsNotEmpty()
  salary: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate phải có định dạng Date' })
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'endDate phải có định dạng Date' })
  endDate: Date;

  isActive: boolean;
}
