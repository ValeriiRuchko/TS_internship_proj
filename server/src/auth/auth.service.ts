import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { genSalt, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(registerUserDto: RegisterUserDto) {
    let existingUser: User | undefined;
    try {
      existingUser = await this.usersService.findOneByEmail(
        registerUserDto.email,
      );
    } catch (err) {
      console.log("User by email hasn't been found");
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
    this.usersService.create(newUser);
    return newUser;
  }

  async signIn(loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    const existingUser = await this.usersService.findOneByEmail(email);
    if (!existingUser) {
      throw new HttpException(
        "User with such email doesn't exists",
        HttpStatus.NOT_FOUND,
      );
    }

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
}
