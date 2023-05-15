import { Note } from './note';

export interface User {
  username: string;
  email: string;
  passwordHash: string;
  dateOfRegistration?: Date;
  id?: string;
  notes?: Note[];
}

export interface UserGQL {
  username: string;
  email: string;
  token?: string;
  id?: string;
  notes?: Note[];
}
