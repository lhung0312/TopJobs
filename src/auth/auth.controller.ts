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
import { Public } from 'src/decorators/customizePublic';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ResponseMessage } from 'src/decorators/message.customize';
import { Response } from 'express';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ResponseMessage('Login user success')
  @UseGuards(LocalAuthGuard)
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
  @Public()
  @ResponseMessage('get user information')
  @Get('account')
  accountUser(@User() user: IUser) {
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
