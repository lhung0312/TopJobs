import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  age: number;
  @Prop()
  gender: string;
  @Prop()
  address: string;
  @Prop({ type: Object })
  company: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
    required: true,
  })
  role: mongoose.Schema.Types.ObjectId;
  @Prop()
  refreshToken: string;
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  @Prop()
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
