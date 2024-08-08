import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { genSalt, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { User } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) { }

  async signUp(registerUserDto: RegisterUserDto) {
    let existingUser: User | undefined;
    try {
      existingUser = await this.usersService.findOneByEmail(
        registerUserDto.email,
      );
    } catch (err) {
      this.logger.debug("User by email hasn't been found");
    }

    if (existingUser) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const salt = await genSalt();
    const hashedPass = await hash(registerUserDto.password, salt);
    // ----
    const newUser = {
      name: registerUserDto.name,
      surname: registerUserDto.surname,
      email: registerUserDto.email,
      password: hashedPass,
      salt,
    };
    const user = await this.usersService.create(newUser);
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
  }

  async signIn(loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    const existingUser = await this.usersService.findOneByEmail(email);

    const hashedPass = await hash(password, existingUser.salt);
    if (hashedPass !== existingUser.password) {
      throw new HttpException(
        'Wrong password provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    // creating JWT token
    const payload = { sub: existingUser.id, isPremium: existingUser.isPremium };

    return {
      access_token: await this.jwtService.signAsync(payload),
      id: existingUser.id,
      name: existingUser.name,
      surname: existingUser.surname,
    };
  }

  async verifyJwt(token: string) {
    try {
      //getting expiration time, as by one of conventions of JWT
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (err) {
      throw new HttpException('Invalid JWT token', HttpStatus.BAD_REQUEST);
    }
  }

  async simulatePremium(sub: string): Promise<{ access_token: string }> {
    // updating user's premium status to true, also will throw an err if smth goes wrong, so good
    await this.usersService.update(sub, { isPremium: true });
    // here we get user AFTER update so that DB was the only source of truth
    const user = await this.usersService.findOneById(sub);

    const payload = { sub: user.id, isPremium: user.isPremium };

    this.logger.debug("User's updated payload got from db", payload);

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
