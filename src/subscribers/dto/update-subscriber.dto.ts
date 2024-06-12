import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriberDto } from './create-subscriber.dto';
import mongoose from 'mongoose';

export class UpdateSubscriberDto extends PartialType(CreateSubscriberDto) {
  _id: mongoose.Schema.Types.ObjectId;
}
