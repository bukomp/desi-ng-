import { User } from './user';
export interface Note {
  content: string;
  header: string;
  favorite: boolean;
  dateOfCreation?: Date;
  id?: string;
  author?: User | string;
}
