import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getUserInformations(@Req() req: Request): Promise<string> {
    return this.usersService.getUserInformations(req);
  }
}
