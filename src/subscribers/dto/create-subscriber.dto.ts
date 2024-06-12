import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  name: String;
  @IsEmail()
  @IsNotEmpty()
  email: String;
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  skills: String[];
}
