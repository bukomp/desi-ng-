import { Token } from '../../models';
import { HashService } from '../../services/utils/hash.service';
import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLBoolean } from 'graphql';
import { UserDBService } from '../../services/user.service';
import { NoteDBService } from '../../services/note.service';
import { TokenService } from '../../services/utils/token.service';
import { User } from '../../models';
import { Note } from '../../models/note';

export class NotesGQLSchema {
  private NotesMutation: GraphQLObjectType<any, any>;
  private NotesQuery: GraphQLObjectType<any, any>;
  constructor(
    private userType: GraphQLObjectType<any, any>,
    private notesType: GraphQLObjectType<any, any>,
    private userDBService: UserDBService,
    private noteDBService: NoteDBService,
    private tokenService: TokenService,
    private hashService: HashService
  ) {
    this.NotesQuery = this.setNotesQuery();
    this.NotesMutation = this.setNotesMutation();
  }

  public getNotesGQLSchema(): GraphQLSchema {
    return new GraphQLSchema({ query: this.NotesQuery, mutation: this.NotesMutation });
  }

  private setNotesQuery(): GraphQLObjectType<any, any> {
    return new GraphQLObjectType({
      name: 'NotesQuery',
      fields: {
        getUserNotes: {
          type: new GraphQLList(this.notesType),
          args: { token: { type: GraphQLString } },
          resolve: async (parent, args) => {
            return await this.getUserNotes(args.token);
          },
        },
        getUserNoteById: {
          type: this.notesType,
          args: { token: { type: GraphQLString }, noteId: { type: GraphQLString } },
          resolve: async (parent, args) => {
            return await this.getNoteById(args.token, args.noteId);
          },
        },
      },
    });
  }

  private async getUserNotes(token: string): Promise<Note[]> {
    try {
      const decodedToken: Token = this.checkToken(token);

      const notes: Note[] = await this.noteDBService.getNotes(decodedToken.id);
      notes.map((note) => delete note.author);
      const response = notes;

      return response;
    } catch (error) {
      throw error;
    }
  }

  private async getNoteById(token: string, noteId: string): Promise<Note | null> {
    try {
      if (!token) {
        throw new Error('Token was not provided');
      }
      const decodedToken: Token = this.checkToken(token);

      const note: Note | null = await this.noteDBService.getNote(noteId);
      if (!note) {
        return null;
      }
      note.author = note.author as User;
      if (note.author.id !== decodedToken.id) {
        throw new Error('You do not have permission to view this note');
      }
      delete note.author;
      return note;
    } catch (error) {
      throw error;
    }
  }

  private setNotesMutation(): GraphQLObjectType<any, any> {
    return new GraphQLObjectType({
      name: 'NotesMutation',
      fields: {
        create: {
          type: this.notesType,
          args: {
            token: { type: GraphQLString },
            header: { type: GraphQLString },
            content: { type: GraphQLString },
            favorite: { type: GraphQLBoolean },
          },
          resolve: async (parent, args) => {
            return await this.createNote(args.token, args.header, args.content, args.favorite);
          },
        },
        update: {
          type: this.notesType,
          args: {
            noteId: { type: GraphQLString },
            newHeader: { type: GraphQLString },
            newContent: { type: GraphQLString },
            token: { type: GraphQLString },
            favorite: { type: GraphQLBoolean },
          },
          resolve: async (parent, args) => {
            return await this.updateNote(args.token, args.noteId, args.newHeader, args.newContent, args.favorite);
          },
        },
        delete: {
          type: GraphQLBoolean,
          args: {
            noteId: { type: GraphQLString },
            token: { type: GraphQLString },
          },
          resolve: async (parent, args) => {
            return await this.deleteNote(args.token, args.noteId);
          },
        },
      },
    });
  }

  private async createNote(token: string, header: string, content: string, favorite: boolean): Promise<Note> {
    try {
      if (!header) {
        throw new Error('Header of note was not provided');
      }
      const decodedToken: Token = this.checkToken(token);

      const newNote: Note = {
        header,
        content: content ? content : '',
        favorite,
        dateOfCreation: new Date(),
        author: decodedToken.id,
      };

      const note: Note | null = await this.noteDBService.createNote(decodedToken.id, newNote);
      if (!note) {
        throw new Error('There was an error creating new Note');
      }
      note.author = (note.author as string).toString() as string;

      delete note.author;

      return note;
    } catch (error) {
      throw error;
    }
  }

  private async updateNote(token: string, noteId: string, newHeader: string, newContent: string, favorite: boolean): Promise<Note> {
    try {
      if (!noteId) {
        throw new Error('Note id was not specified');
      }
      this.checkToken(token);

      const newNote = {
        id: noteId,
        header: newHeader,
        favorite,
        content: newContent,
      };

      const note: Note | null = await this.noteDBService.updateNote(newNote);
      if (!note) {
        throw new Error('Note with provided id was not found or there was another error');
      }
      delete note.author;

      return note;
    } catch (error) {
      throw error;
    }
  }

  private async deleteNote(token: string, noteId: string): Promise<boolean> {
    try {
      if (!noteId) {
        throw new Error('Note id was not specified');
      }
      this.checkToken(token);

      const note: boolean = await this.noteDBService.deleteNote(noteId);

      if (!note) {
        throw new Error('Note with provided id was not found or there was another error');
      }

      return note;
    } catch (error) {
      throw error;
    }
  }

  private checkToken(token: string): Token {
    try {
      if (!token) {
        throw new Error('Token was not provided');
      }
      const decodedToken: Token = this.tokenService.verifyToken(token);
      if (decodedToken.lastUseDay < new Date()) {
        throw new Error('Token is outdated, please renew token');
      }
      return decodedToken;
    } catch (error) {
      throw error;
    }
  }
}
