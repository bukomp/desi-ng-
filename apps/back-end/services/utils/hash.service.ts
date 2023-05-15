import bcrypt from 'bcryptjs';

export class HashService {
  private saltRounds: number;
  constructor(saltRounds?: number) {
    this.saltRounds = saltRounds || 15;
  }

  public compareHash(password: string, hash: string): boolean {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (error) {
      throw error;
    }
  }

  public getHash(password: string): string {
    try {
      return bcrypt.hashSync(password, this.saltRounds);
    } catch (error) {
      throw error;
    }
  }
}
