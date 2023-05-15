import { GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';

export class NoteType {
  private noteType: GraphQLObjectType;

  constructor() {
    this.noteType = new GraphQLObjectType({
      name: 'Notes',
      fields: () => ({
        id: { type: GraphQLString },
        content: { type: GraphQLString },
        favorite: { type: GraphQLBoolean },
        header: { type: GraphQLString },
        dateOfCreation: { type: GraphQLString },
      }),
    });
  }

  public getNoteType(): GraphQLObjectType {
    return this.noteType;
  }
}
