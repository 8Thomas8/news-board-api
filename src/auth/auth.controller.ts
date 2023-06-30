import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from './dto/login-credentials-dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('subscribe')
  register(
    @Body() userData: UserSubscribeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return this.authService.register(userData, res);
  }

  @Post('login')
  login(
    @Body() credentials: LoginCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return this.authService.login(credentials, res);
  }
}
