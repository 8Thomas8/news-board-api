import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(userData: UserSubscribeDto): Promise<Partial<User>> {
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

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async login(credentials: LoginCredentialsDto): Promise<Partial<User>> {
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

    return {
      username: user.username,
      email: email,
      role: user.role,
    };
  }
}
