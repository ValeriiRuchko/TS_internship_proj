export class CreateUserDto {
  name: string;
  surname: string;
  email: string;
  salt: string;
  password: string;
  isPremium?: boolean;
}
