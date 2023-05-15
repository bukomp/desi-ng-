import { NoteService } from './note.service';
import { UserGQL } from '../models/user';
import { Injectable } from '@angular/core';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: UserGQL;

  constructor(private noteService: NoteService) {
    this.user = {
      username: null,
      email: null,
    };
  }

  public setUser(user: UserGQL): void {
    this.user = user;
  }

  public getUser(): UserGQL {
    return this.user;
  }

  public clearUser(): void {
    try {
      this.user = {
        username: null,
        email: null,
      };
      this.noteService.clearNotes();
      window.localStorage.removeItem('token');
    } catch (error) {
      throw error;
    }
  }
}
