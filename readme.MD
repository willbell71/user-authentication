# Login

Simple user authentication example using JWT, along with clients in Angular and ReactJS.

A NodeJS ( and TS implementation ) API to
- Log in
- Log out
- Register
- Access protected route<br/>

TDD with mocha for the JS version, and jest for the TS version.

Angular and ReactTS Clients
- Log in page
- Register page
- Dashboard<br/>

TDD with jasmine for Angular, jest for ReactTS.

MongoDB / Mongoose
- Store users

Docker containers<br/>
Docker compose<br/>
Kubernetes deployment script<br/>
Azure pipeline for GitHub ( CI )

## Development

### Local Set up

Add a `.env` file to root of api
```
MODE="development"
PORT=3000
LOG_LEVEL="ALL"
USE_COMPRESSION=true
DISABLE_CORS=true
DB_CONNECTION="mongodb://bobdylan:tangledupinblue@mongodb/loginappdb?authSource=admin"
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

### Kubernetes

Start Minikube<br/>
>`minikube start`

Start Minikube<br/>
>`minikube stop`

Enable Ingress Addon
>`minikube addons enable ingress`
Verify with
>`kubectl get pods -n kube-system`
Can be slow to start

Switch Docker to Minikube repo, ensuring minikube is started first<br/>
>`eval $(minikube docker-env)`

Deploy to minikube
>`kubectl apply -f kubernetes.yaml`

Delete deployment
>`kubectl delete namespace login`

List pods
>`kubectl get pods -n login`

Get pod log
>`kubectl logs ???? -n login`
Where ???? is the name of the pod as displayed by `get pods`

Shell into pod
>`kubectl -n login exec -it ???? -- /bin/sh`
Where ???? is the name of the pod as displayed by `get pods`

Get minikube IP with
>`minikube ip`
Use this in hosts, associate the minikube ip with the domain name in the yaml

Shell into mongo container and connect to db
>`kubectl -n login exec -it mongodb-0 bash`
>`mongo mongodb://bobdylan:tangledupinblue@mongodb-0/loginappdb?authSource=admin`

## TODO

### Angular

D 1. Clear down Angular scaffold<br/>
D 2. Add login page<br/>
D 3. Add register page<br/>
D 4. Add dashboard page<br/>
D 5. Integrate NodeJS API<br/>
D 6. Protect dashboard route<br/>
- 7. Refactor forms to a shared component ?
- 8. Angular animations

D 9. Interceptor - delete token, if request fails auth ( 401 )

### ReactTS

D 1. Set up a React build system using Typescript.<br/>
D 2. Add login page<br/>
D 3. Add register page<br/>
D 4. Add dashboard page<br/>
D 5. Integrate NodeJS API using Fetch<br/>
D 6. Protect dashboard route

### NodeJS API

D 1. Set up basic express server boiler plate<br/>
D 2. Set up mongoose / mongo connection<br/>
D 3. Add model for user<br/>
D 4. Add log in route<br/>
D 5. Add log out route<br/>
D 6. Add register route<br/>
D 7. Add dummy protected route ( used to populate dashboard with dummy content )<br/>
- 8. Integration tests

### Docker

I 1. Set up container for NGINX, to serve clients ( angular and react clients on different hosts )<br/>
I 2. Set up container for Angular client<br/>
I 3. Set up container for ReactTS client<br/>
I 4. Set up container for NodeJS API<br/>
I 5. Set up docker compose ( nginx, mongo, node api )<br/>
- 6. Set up Kubernetes deployment script
- 7. NGINX HTTP2
- 8. NGINX HTTPS

### Azure pipelines

- 1. Push built containers to docker hub
