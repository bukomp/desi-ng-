import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphQLModule {
  private readonly URI1: string = !environment.production ? 'http://localhost:4003/api/user' : window.location.origin + '/api/user';
  private readonly URI2: string = !environment.production ? 'http://localhost:4003/api/notes' : window.location.origin + '/api/notes';

  constructor(apollo: Apollo, httpLink: HttpLink) {
    const options1: any = { uri: this.URI1 };
    apollo.createDefault({
      link: httpLink.create(options1),
      cache: new InMemoryCache(),
      defaultOptions: {
        mutate: {
          errorPolicy: 'all',
        },
        query: {
          errorPolicy: 'all',
        },
        watchQuery: {
          errorPolicy: 'all',
        },
      },
    });

    const options2: any = { uri: this.URI2 };
    apollo.createNamed('notesEndpoint', {
      link: httpLink.create(options2),
      cache: new InMemoryCache(),
      defaultOptions: {
        mutate: {
          errorPolicy: 'all',
        },
        query: {
          errorPolicy: 'all',
        },
        watchQuery: {
          errorPolicy: 'all',
        },
      },
    });
  }
}
