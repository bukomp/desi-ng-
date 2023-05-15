import mongoose, { Document } from 'mongoose';
import { Notes, Users } from '../database/schemas/';
import { User } from '../models/user';

export class UserDBService {
  private User: mongoose.Model<mongoose.Document> = Users;
  private Note: mongoose.Model<mongoose.Document> = Notes;

  public async getUser(id?: string, username?: string, email?: string): Promise<User | null> {
    try {
      if (id) {
        const fetchedUser: Document | null = await this.User.findById(id).populate('notes');
        return fetchedUser ? fetchedUser.toJSON() : null;
      } else if (username) {
        const fetchedUser: Document | null = await this.User.findOne({ username }).populate('notes');
        return fetchedUser ? fetchedUser.toJSON() : null;
      } else if (email) {
        const fetchedUser: Document | null = await this.User.findOne({ email }).populate('notes');
        return fetchedUser ? fetchedUser.toJSON() : null;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  public async createUser(user: User): Promise<User | null> {
    try {
      const newUser = new this.User(user);

      return (await newUser.save()).toJSON();
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(user: User): Promise<User | null> {
    try {
      await this.User.updateOne({ _id: user.id }, user);
      const updateUser: Document | null = await this.User.findById(user.id);
      return updateUser ? updateUser.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUser(id: string): Promise<User | null> {
    try {
      const fetchedUser: Document | null = await this.User.findById(id);
      await this.User.deleteOne({ _id: id });
      await this.Note.deleteMany({ author: id });
      return fetchedUser ? fetchedUser.toJSON() : null;
    } catch (error) {
      throw error;
    }
  }
}
