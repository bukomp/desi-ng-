import { MainGQL } from './graphQL/mainGQL';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import path from 'path';
import cors from 'cors';

export class App {
  private SECRET: string;
  private DB_URL: string;
  private PORT: number;

  private app: express.Express;

  private mainGQL: MainGQL;

  constructor() {
    config();

    this.SECRET = process.env.SECRET as string;
    this.DB_URL = process.env.DB_URL as string;
    this.PORT = (+(process.env.PORT as string) as number) || 4003;

    this.app = express();

    this.mainGQL = new MainGQL(this.SECRET);
  }

  public async start(): Promise<void> {
    try {
      await this.init();

      this.app.listen(this.PORT, () => {
        console.log(`App is listening to port: ${this.PORT}`);
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async init(): Promise<void> {
    try {
      await mongoose.connect(this.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('MongoDB Connected');

      this.app.enable('trust proxy');

      this.app.use(cors());

      this.app.use((req, res, next) => {
        if (req.secure || process.env.NODE_ENV === 'development') {
          next();
        } else {
          res.redirect('https://' + req.headers.host + req.url);
          return;
        }
      });

      this.app.use(express.static(path.join(process.cwd(), 'build', 'static')));

      const enableGraphi: boolean = process.env.NODE_ENV === 'development' || process.env.GRAPHI === 'enable';

      this.app.use(
        '/api/user',
        graphqlHTTP({
          schema: this.mainGQL.getUserGQLSchema(),
          graphiql: enableGraphi,
        })
      );
      this.app.use(
        '/api/notes',
        graphqlHTTP({
          schema: this.mainGQL.getNotesGQLSchema(),
          graphiql: enableGraphi,
        })
      );

      this.app.use('*', (req, res) => {
        if (req.secure || process.env.NODE_ENV !== 'development') {
          res.redirect('https://' + req.headers.host);
        } else {
          res.redirect('http://' + req.headers.host);
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
