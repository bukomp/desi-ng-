## Disclaimer

*This project, called Desi{ng}, was completed during my time studying at Metropolia. It is an online notepad that allows users to create an account, log in, and manage their notes through a user-friendly interface. The application is designed for people who want to better organize their lives. Users can easily save, read, remove, and send notes using the web page, which is built with Angular framework and offers an open GraphQL API for easy integration with other interfaces or as an addon/plugin. However, the link to the application is currently down since I have finished my studies at Metropolia.*

# Desi{ng}

#### _"Desi{ng} your life, your way"_

[Link to the application hosted in Jelastic](https://desing.jelastic.metropolia.fi/)
<br>

## Main Idea
Project is going to be an online notepad. Users will create an account and login to the game through the web-page with adaptive interface. After users registration they will be able to save, read, remove and send notes. 
Web-page will use open GraphQL API so it will be easy to create your own interface for this application or even you could add it to your own page as an addon/plugin.

Name comes from Angular framework as it is Angular's abbreviation (ng).

### Server-Side
Server-side of this project will process all the data and users actions. Also it will provide my front-end solution of the application.

### Client-Side
Client-Side will provide user-friendly interface written using Angular framework, through which you will be able to interact with the application.

### Focus Group
Application is targeted to people who want to better manage their own life.

# How to use?

1. Register to access your account
2. On the users page, you could start by creating first note. You can do it by pressing pen button in right bottom corner.
3. Star on the users page acts as a favorite switch, if enabled (turns black) it shows only favorite notes and vice versa.

# .env

| Variable | Definition                                   | Predefined values        |
| -------- | -------------------------------------------- | ------------------------ |
| PORT     | determines which port does server listen     | -                        |
| SECRET   | sets string used in token encoding           | -                        |
| NODE_ENV | defines environment                          | development, production  |
| GRAPHI   | defines whether graphi should/shouldn't work | enable, disable          |
| DB_URL   | MongoDB url used to connect to database      | _\<MongoDB URL string\>_ |

# GraphQL API

_"GraphQL provides a complete and understandable description of the data in your API..."_

- Every time user does any user related request (CRUD user), its token automatically updates and is saved in front-end

# Tools & Solutions

- VSCode

### Back-end packages:

- express
- dotenv
- mongoose
- qraphql
  - express-graphql
- ts-node-dev
- jsonwebtoken
- path
- tslint

### Fron-End packages:

- Angular
- Apollo Client
