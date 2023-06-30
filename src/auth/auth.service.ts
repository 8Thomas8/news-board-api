import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials-dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  username: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(userData: UserSubscribeDto, res: Response): Promise<void> {
    const user = this.userRepository.create({
      ...userData,
    });
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException(
        "Le nom d'utilisateur ou l'email existe déjà.",
      );
    }

    const payload = {
      username: user.username,
      email: user.email,
      role: user.role,
    };

    this.generateResponseWithCookie(res, payload);
  }

  async login(credentials: LoginCredentialsDto, res: Response): Promise<void> {
    const { email, password } = credentials;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {
        email,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException(
        "Le nom d'utilisateur ou le mot de passe est incorrect.",
      );
    }

    const hashPassword = await bcrypt.hash(password, user.salt);
    if (hashPassword !== user.password) {
      throw new NotFoundException(
        "Le nom d'utilisateur ou le mot de passe est incorrect.",
      );
    }

    const payload = {
      username: user.username,
      email: email,
      role: user.role,
    };

    this.generateResponseWithCookie(res, payload);
  }

  async generateJwt(payload: JwtPayload): Promise<string> {
    return await this.jwtService.sign(payload);
  }

  async generateResponseWithCookie(
    res: Response,
    payload: JwtPayload,
  ): Promise<Response> {
    return res
      .cookie('Authentication', await this.generateJwt(payload), {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(
          Date.now() + parseInt(this.configService.get('JWT_EXPIRES_IN')),
        ),
      })
      .send();
  }
}
