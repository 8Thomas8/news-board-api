import { Body, Controller, Post } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginCredentialsDto } from './dto/login-credentials-dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('subscribe')
  register(@Body() userData: UserSubscribeDto): Promise<Partial<User>> {
    return this.userService.register(userData);
  }

  @Post('login')
  login(@Body() credentials: LoginCredentialsDto): Promise<Partial<User>> {
    return this.userService.login(credentials);
  }
}
