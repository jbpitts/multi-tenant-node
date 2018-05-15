# Multi Tenant Node

This is a multi tenant implementation in Node.js using GraphQL and RESTful API written in TypeScript.

Inspired by Laravel, typeorm, typestack and w3tecch.

Currently tested against PostgreSQL database.
 
## Setup

Install Postgres and create database

    create database ls;

Install yarn

    npm install yarn -g
    
Copy .env.example to .env, .env.test.example to .env.test

    cp .env.example .env
    cp .env.test.example .env.test
    
Run setup

    npm run setup
    
Serve

    npm start serve
    
Server will be available on port [http://localhost:3000](http://localhost:3000). The web framework is provided via [express](https://expressjs.com/) package.

## Scripts

All scripts are defined in `package-scripts.js`. Best to review scripts.

Hint: install nps globally, allows for quick execution of scripts in package-scripts.js

## Production

Build server (JavaScript)

    npm start build
    
Run server in `dist` directory

    npm start
    
## Tests

All test are run via [Jest](http://facebook.github.io/jest/). Also use [nock](https://github.com/node-nock/nock) for HTTP mocking and  [supertest](https://github.com/visionmedia/supertest) to make real HTTP calls.

Unit tests

    npm start test
    
Integration tests

    npm start test.integration
    
End 2 End tests

    npm start test.e2e
    
## ORM

[typeorm](https://github.com/typeorm/typeorm) is used for ORM. Models can be found in `src/api/models`, repositories in `src/api/repositories`, subscribers in `src/api/subscribers`, etc (you get the point)

Repositories are supported by services, services are used by api/graphql controllers to interface with ORM. Services are defined in `src/api/services`.

## GraphQL

GraphQL types, controllers, etc are in `src/api/schema`, the [vesper](https://github.com/vesper-framework/vesper) package was used to add graphql support. The main graphql endpoint is

    /graphql
    
For interactive testing, you will need Authorization header `"Authorization": "Bearer 1"`

    /playground
    
## API and Swagger

Main controllers for RESTful API are `src/api/controllers`, the [routing-controllers](https://github.com/typestack/routing-controllers) package was used to add REST. RESTful API is located at:

    /api
    
Swagger only has a small part of the API defined, however default swagger user is `admin/1234`. Default authorization is to enter `Bearer 1`.

    /swagger 

## Migration & Seeding

Migrations are done via [typeorm](https://github.com/typeorm/typeorm). 

Both Migrations and Seeds can be found in `src/database`.

## Docker

Build

    docker build -t <your-image-name> .
    
Run 

    docker run -i -t -p 3000:3000 <your-image-name>
    
Stop

    docker ps
    docker stop <container-id>
    
Recommend moving to a docker-compose for running and adding postgres image as well.

###Docker environment variables

There are several options to configure your app inside a Docker container

*project .env file*

You can use .env file in project root folder which will be copied inside Docker image. If you want to change a property inside .env you have to rebuild your Docker image.

*run options*

You can also change app configuration by passing environment variables via docker run option -e or --env.

    docker run --env DB_HOST=docker.for.mac.host.internal -e DB_PORT=5432 -i -t -p 3000:3000 <your-image-name>

*environment file*

Last but not least you can pass a config file to docker run.

    docker run --env-file ./env.list

env.list example:

    # this is a comment
    DB_TYPE=mysql
    DB_HOST=localhost
    DB_PORT=3306

## Next Steps

 - Generation, generation, generation, need to generate Models, Repos, Services, GraphQL types, Controllers, Migrations from definition or database.
 - Common functionality can be further extracted into composition or inheritance design
 - Add or call authorization
    
## Initial Seed Project

Initial seed taken from [w3tecch boilerplate](https://github.com/w3tecch/express-typescript-boilerplate), a lot of changes where made.

Major Differences
 - move to Postgresql
 - updates to packages, big change in typeorm
 - added models for mutli-tenance via client with subscribers and keys
 - vesper for graphql
 - updated tests
 - production seeds
 - fixes

 