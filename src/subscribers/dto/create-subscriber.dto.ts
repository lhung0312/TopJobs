import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  @ApiProperty()
  name: String;
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  email: String;
  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  skills: String[];
}
