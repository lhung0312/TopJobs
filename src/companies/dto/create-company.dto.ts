import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  name: String;
  @ApiProperty()
  @IsNotEmpty()
  address: String;
  @ApiProperty()
  @IsNotEmpty()
  description: String;
  @ApiProperty()
  @IsNotEmpty()
  image: String;
}
