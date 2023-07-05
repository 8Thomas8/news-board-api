import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserInformations(req: Request, res: Response): Promise<void> {
    const token = req.cookies['Authentication'];

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    const email = await this.authService.verifyJwt(token);

    if (!email) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', email)
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password;
    delete user.salt;

    res.send(user);
  }
}
