import { Token } from './../../models/token';
import jwt from 'jsonwebtoken';

export class TokenService {
  private secret: string;

  constructor(secret?: string) {
    this.secret = secret || (process.env.SECRET as string);
  }

  public verifyToken(token: string): Token {
    try {
      const payload = jwt.verify(token, this.secret);
      return payload as Token;
    } catch (error) {
      throw error;
    }
  }

  public generateToken(payload: { id: string; username: string; email: string }): string {
    try {
      const tokenObject = payload as { id: string; username: string; email: string; lastUseDay: Date };
      const lastUseDay: Date = new Date();
      lastUseDay.setDate(lastUseDay.getDate() + 1);
      tokenObject.lastUseDay = lastUseDay;
      const token = jwt.sign(tokenObject, this.secret);
      return token;
    } catch (error) {
      throw error;
    }
  }

  public updateToken(token: string): string {
    try {
      const payload: Token = jwt.verify(token, this.secret) as Token;
      delete payload.lastUseDay;
      return this.generateToken(payload);
    } catch (error) {
      throw error;
    }
  }
}
