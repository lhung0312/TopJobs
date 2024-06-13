import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriberDto } from './create-subscriber.dto';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriberDto extends PartialType(CreateSubscriberDto) {
  @ApiProperty()
  _id: mongoose.Schema.Types.ObjectId;
}
