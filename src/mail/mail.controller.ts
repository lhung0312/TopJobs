import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public } from 'src/decorators/publicAuth';
import { ResponseMessage } from 'src/decorators/responseMessage';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // handleCron() {
  //   console.log('Called every 30 seconds');
  // }

  @Get()
  @Public()
  @ResponseMessage('Test email')
  @Cron('0 10 0 * * 0')
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: { $in: subsSkills },
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
            skills: item.skills,
          };
        });
        await this.mailerService.sendMail({
          to: 'info.tuanhung@gmail.com',
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
