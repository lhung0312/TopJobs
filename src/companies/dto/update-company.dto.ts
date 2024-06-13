import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiProperty()
  _id: string;
}
