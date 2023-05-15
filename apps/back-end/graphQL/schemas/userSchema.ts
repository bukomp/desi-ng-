import { UserGQL } from '../../models/user';
import { Token } from '../../models';
import { HashService } from '../../services/utils/hash.service';
import { GraphQLObjectType, GraphQLString, GraphQLSchema } from 'graphql';
import { UserDBService } from '../../services/user.service';
import { NoteDBService } from '../../services/note.service';
import { TokenService } from '../../services/utils/token.service';
import { User } from '../../models';

export class UserGQLSchema {
  private UserMutation: GraphQLObjectType<any, any>;
  private UserQuery: GraphQLObjectType<any, any>;
  constructor(
    private userType: GraphQLObjectType<any, any>,
    private notesType: GraphQLObjectType<any, any>,
    private userDBService: UserDBService,
    private noteDBService: NoteDBService,
    private tokenService: TokenService,
    private hashService: HashService
  ) {
    this.UserQuery = this.setUserQuery();
    this.UserMutation = this.setUserMutation();
  }

  public getUserGQLSchema(): GraphQLSchema {
    return new GraphQLSchema({
      query: this.UserQuery,
      mutation: this.UserMutation,
    });
  }

  private setUserQuery(): GraphQLObjectType<any, any> {
    return new GraphQLObjectType({
      name: 'UserQuery',
      fields: {
        getUserData: {
          type: this.userType,
          args: { token: { type: GraphQLString } },
          resolve: async (parent, args) => {
            return await this.getUserData(args.token);
          },
        },
        login: {
          type: this.userType,
          args: {
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
            token: { type: GraphQLString },
          },
          resolve: async (parent, args) => {
            return await this.login(args.token, args.username, args.email, args.password);
          },
        },
      },
    });
  }

  private async getUserData(token: string): Promise<UserGQL> {
    try {
      const decodedToken: Token = this.checkToken(token);

      const user: User | null = await this.userDBService.getUser(decodedToken.id);
      if (!user) {
        throw new Error(`User ${decodedToken.username} does not exist`);
      }

      return {
        token: this.tokenService.updateToken(token),
        id: user.id,
        username: user.username,
        email: user.email,
      } as UserGQL;
    } catch (error) {
      throw error;
    }
  }

  private async login(token: string, username: string, email: string, password: string): Promise<UserGQL> {
    try {
      if (!username && !email && !token) {
        // if user doesn't provide username, email or token
        throw new Error('User did not provide identification');
      } else if (token) {
        // if user provided token
        const decodedToken: Token = this.checkToken(token);

        // ... and token is valid
        const user = await this.userDBService.getUser(decodedToken.id);
        if (!user) {
          // ... and user does not exist
          throw new Error(`User ${username} does not exist`);
        }
        // .. and user exists
        const generatedToken: string = this.tokenService.generateToken({
          id: user.id as string,
          username: user.username,
          email: user.email,
        });
        return {
          token: token ? this.tokenService.updateToken(token) : generatedToken,
          id: user.id as string,
          username: user.username,
          email: user.email,
        } as UserGQL;
      } else {
        if (!password) {
          throw new Error('User did not provide password');
        } else {
          const user: User | null = await this.userDBService.getUser(undefined, username, email);
          if (!user) {
            // if user does not exist
            throw new Error(`User ${username || email} does not exist`);
          }
          if (this.hashService.compareHash(password, user.passwordHash)) {
            const generatedToken: string = this.tokenService.generateToken({
              id: user.id as string,
              username: user.username,
              email: user.email,
            });
            return {
              token: token ? this.tokenService.updateToken(token) : generatedToken,
              id: user.id as string,
              username: user.username,
              email: user.email,
            } as UserGQL;
          } else {
            throw new Error('Passwords do not match');
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private setUserMutation(): GraphQLObjectType<any, any> {
    return new GraphQLObjectType({
      name: 'UserMutation',
      fields: {
        register: {
          type: this.userType,
          args: {
            username: { type: GraphQLString },
            email: { type: GraphQLString },
            password: { type: GraphQLString },
          },
          resolve: async (parent, args) => {
            return await this.register(args.username, args.email, args.password);
          },
        },
        update: {
          type: this.userType,
          args: {
            newUsername: { type: GraphQLString },
            newEmail: { type: GraphQLString },
            newPassword: { type: GraphQLString },
            password: { type: GraphQLString },
            token: { type: GraphQLString },
          },
          resolve: async (parent, args) => {
            return await this.update(args.token, args.password, args.newUsername, args.newEmail, args.newPassword);
          },
        },
        delete: {
          type: this.userType,
          args: {
            token: { type: GraphQLString },
            password: { type: GraphQLString },
          },
          resolve: async (parent, args) => {
            return await this.delete(args.token, args.password);
          },
        },
      },
    });
  }

  private async register(username: string, email: string, password: string): Promise<UserGQL> {
    try {
      // checks if user with same name already exists
      if (await this.userDBService.getUser(undefined, username)) {
        throw new Error(`User with ${username} username already exists`);
      }
      const userFind: User | null = await this.userDBService.getUser(undefined, username);
      if (userFind) {
        throw new Error('User already exists');
      }
      const user: User | null = await this.userDBService.createUser({
        username: username as string,
        email: email as string,
        passwordHash: this.hashService.getHash(password),
        dateOfRegistration: new Date(),
      } as User);
      if (!user) {
        // ... and user does not exist
        throw new Error(`Couldn't create user ${username}`);
      }
      const token: string = this.tokenService.generateToken({
        id: user.id as string,
        username: user.username,
        email: user.email,
      });

      return {
        token,
        id: user.id,
        username: user.username,
        email: user.email,
      } as UserGQL;
    } catch (error) {
      throw error;
    }
  }

  private async update(token: string, password: string, newUsername: string, newEmail: string, newPassword: string): Promise<UserGQL> {
    try {
      const decodedToken: Token = this.checkToken(token);

      const user: User | null = await this.userDBService.getUser(decodedToken.id);
      if (!user) {
        // ... and user does not exist
        throw new Error(`User ${decodedToken.username} does not exist`);
      }
      const passwordsMatch = this.hashService.compareHash(password, user.passwordHash);
      if (passwordsMatch) {
        const update: User = {
          id: decodedToken.id,
          username: newUsername,
          email: newEmail,
          passwordHash: newPassword ? this.hashService.getHash(newPassword) : user.passwordHash,
        };
        const updatedUser: User | null = await this.userDBService.updateUser(update);
        if (!updatedUser) {
          // ... and user does not exist
          throw new Error(`User ${decodedToken.username} does not exist`);
        }

        return {
          token: this.tokenService.updateToken(token),
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        } as UserGQL;
      } else {
        throw new Error('Passwords do not match');
      }
    } catch (error) {
      throw error;
    }
  }

  private async delete(token: string, password: string): Promise<UserGQL> {
    try {
      const decodedToken: Token = this.checkToken(token);

      const user: User | null = await this.userDBService.getUser(decodedToken.id);
      if (!user) {
        // ... and user does not exist
        throw new Error(`User ${decodedToken.username} does not exist`);
      }
      const passwordsMatch = this.hashService.compareHash(password, user.passwordHash);
      if (passwordsMatch) {
        await this.userDBService.deleteUser(decodedToken.id);
        return {
          token: '',
          id: user.id,
          username: user.username,
          email: user.email,
        } as UserGQL;
      } else {
        throw new Error('Passwords do not match');
      }
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
