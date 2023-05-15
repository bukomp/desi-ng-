import { Note } from '../models/note';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { login } from '../mockData';
import { FetchResult } from 'apollo-link';

@Injectable({
  providedIn: 'root',
})
export class NoteApiService {
  private baseUrl: string;
  private httpOptions: HttpHeaders;
  private http: HttpClient;

  constructor(private apollo: Apollo) {}

  public async create(token: string, header: string, content: string, favorite: boolean): Promise<Note> {
    try {
      const createMutation = gql`
        mutation create($token: String, $header: String, $content: String, $favorite: Boolean) {
          create(token: $token, header: $header, content: $content, favorite: $favorite) {
            id
            favorite
            content
            header
          }
        }
      `;
      const result: FetchResult<{ create: Note }> = await this.apollo
        .use('notesEndpoint')
        .mutate<{ create: Note }>({
          mutation: createMutation,
          variables: { token, header, content, favorite },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'create note method');
        }

        throw new Error(result.errors[0].message);
      }
      return {
        header: result.data.create.header,
        content: result.data.create.content,
        id: result.data.create.id,
        favorite: result.data.create.favorite,
      };
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async update(token: string, newHeader: string, newContent: string, noteId: string, favorite: boolean): Promise<Note> {
    try {
      const updateMutation = gql`
        mutation update($token: String, $newHeader: String, $newContent: String, $noteId: String, $favorite: Boolean) {
          update(token: $token, newHeader: $newHeader, newContent: $newContent, noteId: $noteId, favorite: $favorite) {
            id
            favorite
            content
            header
          }
        }
      `;
      const result: FetchResult<{ update: Note }> = await this.apollo
        .use('notesEndpoint')
        .mutate<{ update: Note }>({
          mutation: updateMutation,
          variables: { token, newHeader, newContent, noteId, favorite },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'update note method');
        }

        throw new Error(result.errors[0].message);
      }
      return {
        header: result.data.update.header,
        content: result.data.update.content,
        id: result.data.update.id,
        favorite: result.data.update.favorite,
      };
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async delete(token: string, noteId: string): Promise<boolean> {
    try {
      const deleteMutation = gql`
        mutation delete($token: String, $noteId: String) {
          delete(token: $token, noteId: $noteId)
        }
      `;
      const result: FetchResult<{ delete: boolean }> = await this.apollo
        .use('notesEndpoint')
        .mutate<{ delete: boolean }>({
          mutation: deleteMutation,
          variables: { token, noteId },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'remove note method');
        }

        throw new Error(result.errors[0].message);
      }
      return result.data.delete;
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }
}
