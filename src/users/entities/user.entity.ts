import { IsNotEmpty } from 'class-validator';
import { TimestampEntites } from 'src/Generics/timestamp.entites';
import { UserRoleEnum } from 'src/enum/userRole.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends TimestampEntites {
  @PrimaryGeneratedColumn('uuid')
  @IsNotEmpty()
  id: string;

  @Column({
    length: 50,
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: string;
}
