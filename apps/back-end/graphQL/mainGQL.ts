import { NoteType } from './types/note-type.GraphQL';
import { UserType } from './types/user-type.GraphQL';
import { HashService } from './../services/utils/hash.service';
import { UserGQLSchema } from './schemas/userSchema';
import { NotesGQLSchema } from './schemas/notesSchema';
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
import { UserDBService } from '../services/user.service';
import { NoteDBService } from '../services/note.service';

import { TokenService } from './../services/utils/token.service';

export class MainGQL {
  private UserSchema: GraphQLSchema;
  private NotesSchema: GraphQLSchema;

  private userType: GraphQLObjectType<any, any>;
  private noteType: GraphQLObjectType<any, any>;

  private userDBService: UserDBService = new UserDBService();
  private noteDBService: NoteDBService = new NoteDBService();

  private tokenService: TokenService;
  private hashService: HashService;

  constructor(secret: string) {
    this.tokenService = new TokenService(secret);
    this.hashService = new HashService();

    this.noteType = new NoteType().getNoteType();
    this.userType = new UserType(this.noteType, this.tokenService, this.noteDBService).getUserType();

    this.UserSchema = new UserGQLSchema(
      this.userType,
      this.noteType,
      this.userDBService,
      this.noteDBService,
      this.tokenService,
      this.hashService
    ).getUserGQLSchema();

    this.NotesSchema = new NotesGQLSchema(
      this.userType,
      this.noteType,
      this.userDBService,
      this.noteDBService,
      this.tokenService,
      this.hashService
    ).getNotesGQLSchema();
  }

  public getUserGQLSchema(): GraphQLSchema {
    return this.UserSchema;
  }

  public getNotesGQLSchema(): GraphQLSchema {
    return this.NotesSchema;
  }
}
