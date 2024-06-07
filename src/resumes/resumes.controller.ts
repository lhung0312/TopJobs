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
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage } from 'src/decorators/message.customize';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage('create a resume success')
  @Post()
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }
  @ResponseMessage('Fetch resumes with paginate')
  @Get()
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+current, +pageSize, qs);
  }
  @ResponseMessage('Fetch resumes By Id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }
  @ResponseMessage("update resumes'status success")
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }
  @ResponseMessage('delete resume')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
  @ResponseMessage("Fetch user's resume by user")
  @Post('by-user')
  findByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }
}
