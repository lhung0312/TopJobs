import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    const isValid = await this.usersService.IsValidPass(pass, user.password);

    if (user && isValid === true) {
      return user;
    }
    return null;
  }
}
