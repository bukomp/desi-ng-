import { NoteDBService } from './../../services/note.service';
import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { Token } from '../../models';
import { TokenService } from '../../services/utils/token.service';

export class UserType {
  private userType: GraphQLObjectType;

  constructor(private noteType: GraphQLObjectType, private tokenService: TokenService, private noteDBService: NoteDBService) {
    this.userType = new GraphQLObjectType({
      name: 'User',
      fields: () => ({
        token: { type: GraphQLString },
        id: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        notes: {
          type: new GraphQLList(this.noteType),
          resolve: async (parent, args) => {
            try {
              const decodedToken: Token = this.tokenService.verifyToken(parent.token);
              if (decodedToken.lastUseDay < new Date()) {
                throw new Error('Token is outdated');
              }
              parent.token = this.tokenService.updateToken(parent.token);
              return await this.noteDBService.getNotes(parent.id);
            } catch (error) {
              throw error;
            }
          },
        },
      }),
    });
  }

  public getUserType(): GraphQLObjectType {
    return this.userType;
  }
}
