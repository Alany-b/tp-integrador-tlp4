import bcrypt from 'bcrypt';
import { IPasswordHasher } from './IPasswordHasher';

export class BcryptPasswordHasher implements IPasswordHasher {
  constructor(private readonly rounds: number = 10) {}

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.rounds);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}