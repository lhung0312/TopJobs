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
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage } from 'src/decorators/responseMessage';
import { User } from 'src/decorators/getReqUser';
import { IUser } from 'src/users/users.interface';
import { Public } from 'src/decorators/publicAuth';
import { SkipCheckPermission } from 'src/decorators/publicPermission';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @ResponseMessage('Create subscriber success')
  @Post()
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }
  @Post('skills')
  @ResponseMessage("get subscriber's skills")
  @SkipCheckPermission()
  getUserSkill(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Public()
  @ResponseMessage('Fetch subscribers with paginate')
  @Get()
  findAll(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+current, +pageSize, qs);
  }

  @Public()
  @ResponseMessage('Fetch subscriber by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @ResponseMessage('Update subscriber success')
  @SkipCheckPermission()
  @Patch('')
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
