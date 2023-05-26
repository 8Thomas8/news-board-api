import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { LoginCredentialsDto } from './dto/login-credentials-dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('subscribe')
  register(@Body() userData: UserSubscribeDto): Promise<Partial<User>> {
    return this.userService.register(userData);
  }

  @Post('login')
  login(
    @Body() credentials: LoginCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.login(credentials, res);
  }
}
