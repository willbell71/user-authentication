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

## TODO

### Angular

D 1. Clear down Angular scaffold
I 2. Add login page
I 3. Add register page
I 4. Add dashboard page
- 5. Integrate NodeJS API
- 6. Protect dashboard route

### ReactJS

- 1. Set up simple ReactJS build system with webpack, babel etc.
- 2. Add login page
- 3. Add register page
- 4. Add dashboard page
- 5. Integrate NodeJS API using Fetch
- 6. Protect dashboard route

### NodeJS API

D 1. Set up basic express server boiler plate
- 2. Set up mongoose / mongo connection
- 3. Add model for user
- 4. Add log in route
- 5. Add log out route
- 6. Add register route
- 7. Add dummy protected route ( used to populate dashboard with dummy content )

### Docker

- 1. Set up container for NGINX, to serve clients ( angular and react clients on different hosts )
- 2. Set up container for Angular client
- 3. Set up container for ReactJS client
- 4. Set up container for NodeJS API
- 5. Set up docker compose ( nginx, mongo, node api )
- 6. Set up Kubernetes deployment script
