import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserSubscribeDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  password: string;
}
