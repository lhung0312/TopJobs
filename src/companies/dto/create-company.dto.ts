import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'name không được bỏ trống' })
  name: String;
  @IsNotEmpty()
  address: String;
  @IsNotEmpty()
  description: String;
  @IsNotEmpty()
  image: String;
}
