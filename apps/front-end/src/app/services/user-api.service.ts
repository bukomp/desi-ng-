import { UserGQL } from '../models/user';
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
export class UserApiService {
  private baseUrl: string;
  private httpOptions: HttpHeaders;
  private http: HttpClient;

  constructor(private apollo: Apollo) {
    this.baseUrl = environment.baseUrl + '/api';

    this.httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'user-x-access-token': localStorage.getItem('userToken'),
    });
  }
  public async checkPassword(username?: string, email?: string, password?: string): Promise<boolean> {
    try {
      const loginQuery = gql`
        query login($username: String, $email: String, $password: String, $token: String) {
          login(username: $username, email: $email, password: $password, token: $token) {
            token
          }
        }
      `;
      const result: ApolloQueryResult<{ login: UserGQL }> = await this.apollo
        .query<{ login: UserGQL }>({
          query: loginQuery,
          variables: { username, email, password, token: null },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'login method');
        }
        throw new Error(result.errors[0].message);
      }

      this.setToken(result.data.login.token);

      return true;
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async login(username?: string, email?: string, password?: string, token?: string): Promise<UserGQL> {
    try {
      const loginQuery = gql`
        query login($username: String, $email: String, $password: String, $token: String) {
          login(username: $username, email: $email, password: $password, token: $token) {
            token
            username
            email
            notes {
              id
              favorite
              content
              header
            }
          }
        }
      `;
      const result: ApolloQueryResult<{ login: UserGQL }> = await this.apollo
        .query<{ login: UserGQL }>({
          query: loginQuery,
          variables: { username, email, password, token },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'login method');
        }
        throw new Error(result.errors[0].message);
      }

      this.setToken(result.data.login.token);

      return {
        username: result.data.login.username,
        email: result.data.login.email,
        notes: result.data.login.notes,
      } as UserGQL;
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async register(username: string, email: string, password: string): Promise<UserGQL> {
    try {
      const registerMutation = gql`
        mutation register($username: String, $email: String, $password: String) {
          register(username: $username, email: $email, password: $password) {
            token
            username
            email
          }
        }
      `;
      const result: FetchResult<{ register: UserGQL }> = await this.apollo
        .mutate<{ register: UserGQL }>({
          mutation: registerMutation,
          variables: { username, email, password },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'login method');
        }

        throw new Error(result.errors[0].message);
      }

      this.setToken(result.data.register.token);

      return {
        username: result.data.register.username,
        email: result.data.register.email,
      };
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async update(newUsername: string, newEmail: string, newPassword: string, password: string, token: string): Promise<UserGQL> {
    try {
      const updateMutation = gql`
        mutation update($newUsername: String, $newEmail: String, $newPassword: String, $password: String, $token: String) {
          update(newUsername: $newUsername, newEmail: $newEmail, newPassword: $newPassword, password: $password, token: $token) {
            token
            username
            email
          }
        }
      `;
      const result: FetchResult<{ update: UserGQL }> = await this.apollo
        .mutate<{ update: UserGQL }>({
          mutation: updateMutation,
          variables: { newUsername, newEmail, newPassword, password, token },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'login method');
        }

        throw new Error(result.errors[0].message);
      }

      this.setToken(result.data.update.token);

      return {
        username: result.data.update.username,
        email: result.data.update.email,
      };
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async delete(password: string, token: string): Promise<UserGQL> {
    try {
      const deleteMutation = gql`
        mutation delete($password: String, $token: String) {
          delete(password: $password, token: $token) {
            username
            email
          }
        }
      `;
      const result: FetchResult<{ delete: UserGQL }> = await this.apollo
        .mutate<{ delete: UserGQL }>({
          mutation: deleteMutation,
          variables: { password, token },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'delete method');
        }
        throw new Error(result.errors[0].message);
      }

      window.localStorage.removeItem('token');

      return {
        username: result.data.delete.username,
        email: result.data.delete.email,
      } as UserGQL;
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public async getUserData(token: string): Promise<any> {
    try {
      const getUserDataQuery = gql`
        query getUserData($token: String) {
          getUserData(token: $token) {
            token
            username
            email
            notes {
              id
              favorite
              content
              header
            }
          }
        }
      `;
      const result: ApolloQueryResult<{ getUserData: UserGQL }> = await this.apollo
        .query<{ getUserData: UserGQL }>({
          query: getUserDataQuery,
          variables: { token },
        })
        .toPromise();
      if (result.errors && result.errors.length !== 0) {
        if (!environment.production) {
          console.log(result, 'login method');
        }

        throw new Error(result.errors[0].message);
      }

      this.setToken(result.data.getUserData.token);

      return {
        username: result.data.getUserData.username,
        email: result.data.getUserData.email,
        notes: result.data.getUserData.notes,
      };
    } catch (error) {
      if (!environment.production) {
        console.error(error);
      }
      throw error;
    }
  }

  public setToken(token: string): void {
    window.localStorage.setItem('token', token);
  }
}
