import mongoose, { Document } from 'mongoose';
import _ from 'lodash';
import { Users, Notes } from '../database/schemas';
import { Note } from '../models/note';

export class NoteDBService {
  private Note: mongoose.Model<mongoose.Document> = Notes;
  private User: mongoose.Model<mongoose.Document> = Users;

  public async getNotes(userId: string): Promise<Note[]> {
    try {
      const notes: Note[] = (await this.Note.find({ author: mongoose.Types.ObjectId(userId) }).populate('author')).map((note) =>
        note.toJSON()
      );
      return notes;
    } catch (error) {
      throw error;
    }
  }

  public async getNote(noteId: string): Promise<Note | null> {
    try {
      const note: Document | null = await this.Note.findById(noteId).populate('author');
      return note ? note.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  public async createNote(userId: string, note: Note): Promise<Note> {
    try {
      const newNote: Note = (await new this.Note(note).save()).toJSON();
      await this.User.updateOne({ _id: userId }, { $push: { notes: newNote.id } });
      return newNote;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }
      throw error;
    }
  }

  public async updateNote(note: Note): Promise<Note | null> {
    try {
      const out: any = {};
      // checks for any undefined values and removes them
      _(note).forEach((value: any, key: any) => {
        if (!_.isEmpty(value) || _.isBoolean(value)) {
          out[key] = value;
        }
      });
      await this.Note.updateOne({ _id: note.id }, out);
      const updatedNote: Document | null = await this.Note.findById(note.id);
      return updatedNote ? updatedNote.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  public async deleteNote(id: string): Promise<boolean> {
    try {
      await this.Note.deleteOne({ _id: id });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
