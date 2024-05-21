import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: String;
  @IsNotEmpty()
  password: String;
  name: String;
}
