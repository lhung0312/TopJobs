import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schema';
import { Job } from 'src/jobs/schemas/job.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
  @Prop({ required: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  status: string; // PENDING-REVIEWING-APPROVED-REJECTED

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Company.name,
    required: true,
  })
  companyId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Job.name,
    required: true,
  })
  jobId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.Array,
  })
  history: {
    status: string;
    updatedAt: Date;
    updatedBy: {
      _id: mongoose.Schema.Types.ObjectId | string;
      email: string;
    };
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

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
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
