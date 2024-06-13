import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ApiProperty()
  _id: string;
}
