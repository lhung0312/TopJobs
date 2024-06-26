import {
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/decorators/publicAuth';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ResponseMessage } from 'src/decorators/responseMessage';
import { Response } from 'express';
import { User } from 'src/decorators/getReqUser';
import { IUser } from 'src/users/users.interface';
import { Request } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
  ) {}
  @ResponseMessage('Login user success')
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @Public()
  @Post('login')
  async handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(req.user, response);
  }
  @Public()
  @ResponseMessage('Registering user is succeeded')
  @Post('register')
  create(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
  @ResponseMessage('get user information')
  @Get('account')
  async accountUser(@User() user: IUser) {
    const userRole = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = userRole.permissions;
    return { user };
  }
  @Public()
  @ResponseMessage('get user by refreshToken')
  @Get('refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }
  @ResponseMessage('logout ok')
  @Post('logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
