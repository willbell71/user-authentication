# Login

Simple user authentication example using JWT, along with clients in Angular and ReactJS.

A NodeJS API to
- Log in
- Log out
- Register
- Access protected route
TDD with mocha.

Angular and ReactJS Clients
- Log in page
- Register page
- Dashboard
TDD with jasmine for Angular, mocha for ReactJS.

MongoDB / Mongoose
- Store users

Docker containers
Docker compose
Kubernetes deployment script
Azure pipeline for GitHub ( CI )

## Development

### Local Set up

Add a `.env` file to root of api
```
LOGINAPI_NAME="development"
LOGINAPI_PORT=3000
LOGINAPI_LOG_LEVEL="ALL"
LOGINAPI_USE_COMPRESSION=true
LOGINAPI_DISABLE_CORS=true
LOGINAPI_DB_CONNECTION="mongodb://bobdylan:tangledupinblue@mongodb/loginappdb?authSource=admin"
```
Note - Mongo credentials need to match those in the docker compose yml

Build the Angular app, in the `login-angular` folder
>`ng build --watch`

Start up docker
>`docker-compose up`

Use `--build` to force the containers to rebuild themselves
NOTE - this will reset the db
>`docker-compose up --build`

The app runs on port `8080`

To stop docker
>`docker-compose down`

## TODO

### Angular

D 1. Clear down Angular scaffold
D 2. Add login page
D 3. Add register page
D 4. Add dashboard page
D 5. Integrate NodeJS API
D 6. Protect dashboard route
- 7. Refactor forms to a shared component ?
- 8. Angular animations
D 9. Interceptor - delete token, if request fails auth ( 401 )

### ReactTS

D 1. Set up a React build system using Typescript.
I 2. Add login page
I 3. Add register page
I 4. Add dashboard page
- 5. Integrate NodeJS API using Fetch
- 6. Protect dashboard route

### NodeJS API

D 1. Set up basic express server boiler plate
D 2. Set up mongoose / mongo connection
D 3. Add model for user
D 4. Add log in route
D 5. Add log out route
D 6. Add register route
D 7. Add dummy protected route ( used to populate dashboard with dummy content )
- 8. Integration tests

### Docker

I 1. Set up container for NGINX, to serve clients ( angular and react clients on different hosts )
I 2. Set up container for Angular client
- 3. Set up container for ReactJS client
I 4. Set up container for NodeJS API
I 5. Set up docker compose ( nginx, mongo, node api )
- 6. Set up Kubernetes deployment script
- 7. NGINX HTTP2

### Azure pipelines

- 1. Push built containers to docker hub
