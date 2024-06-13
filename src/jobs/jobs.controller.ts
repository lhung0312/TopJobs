import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage } from 'src/decorators/responseMessage';
import { User } from 'src/decorators/getReqUser';
import { IUser } from 'src/users/users.interface';
import { Public } from 'src/decorators/publicAuth';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ResponseMessage('Create job success')
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @ResponseMessage('Fetch jobs with paginate')
  @Get()
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @ResponseMessage('Fetch job by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage('Update job success')
  @Patch('')
  update(@Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(updateJobDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
