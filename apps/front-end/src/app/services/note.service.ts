import { Injectable } from '@angular/core';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[];

  constructor() {
    this.notes = [];
  }

  public addNote(note: Note): void {
    this.notes.push(note);
  }

  public setNotes(notes: Note[]): void {
    this.notes = notes;
  }

  public setNote(id: string, newNote: Note): void {
    this.notes.forEach((note, index) => {
      if (note.id === id) {
        this.notes[index] = newNote;
      }
    });
  }

  public removeNote(id: string): void {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  public getNotes(): Note[] {
    return this.notes;
  }

  public clearNotes(): void {
    try {
      this.notes = [];
    } catch (error) {
      throw error;
    }
  }
}
