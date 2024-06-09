import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = await this.usersService.IsValidPass(pass, user.password);
      if (isValid === true) {
        const userRole = user.role as unknown as { _id: string; name: string };
        const tempRole = await this.rolesService.findOne(userRole._id);
        const objectUser = {
          ...user.toObject(),
          permissions: tempRole?.permissions ?? [],
        };
        return objectUser;
      }
    }

    return null;
  }
  createRefreshToken = (payload: any) => {
    const a = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('SECRET_JWT_REFRESH'),
      expiresIn:
        ms(this.configService.get<string>('EXPIRE_JWT_REFRESH')) / 1000,
    });
    return a;
  };
  async login(user: IUser, response: Response) {
    const { _id, name, email, role, permissions } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateRefreshToken(refresh_token, _id);

    //
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('EXPIRE_JWT_REFRESH')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        permissions,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const registerUser = await this.usersService.registerAuth(registerUserDto);
    return {
      _id: registerUser._id,
      createdAt: registerUser.createdAt,
    };
  }
  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('SECRET_JWT_REFRESH'),
      });
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };
        const refresh_token = this.createRefreshToken(payload);

        await this.usersService.updateRefreshToken(
          refresh_token,
          _id.toString(),
        );
        //fetch userRole
        const userRole = user.role as unknown as { _id: string; name: string };
        const tempRole = await this.rolesService.findOne(userRole._id);
        //
        response.clearCookie('refresh_token');
        response.clearCookie('refresh_token1');

        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('EXPIRE_JWT_REFRESH')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
            Permissions: tempRole?.permissions ?? [],
          },
        };
      } else {
        throw new BadRequestException(`Refresh Token không hợp lệ`);
      }
    } catch (error) {
      throw new BadRequestException(`Refresh Token không hợp lệ`);
    }
  };
  logout = async (response: Response, user: IUser) => {
    response.clearCookie('refresh_token');
    await this.usersService.updateRefreshToken(' ', user._id);
  };
}
