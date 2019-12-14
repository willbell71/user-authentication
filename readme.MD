# Login

Simple user authentication example using JWT.<br/>
Clients in Angular and ReactJS.<br/>
NodeJS / Express is used for the API, with MongoDB to store users.

Docker and docker-compose example scripts for development.<br/>
And a Kubernetes deploy script example for production.

The API offers
- Log in
- Log out
- Register
- Access protected route<br/>

## Building apps

### api

Run npm install first time
>`npm i`

This is just vanilla javascript implementation of a NodeJS / Express API, so doesn't need building as such.

A `.env` file is required in the root of api
```
MODE="development"
PORT=3000
LOG_LEVEL="ALL"
USE_COMPRESSION=true
DISABLE_CORS=true
DB_CONNECTION="mongodb://bobdylan:tangledupinblue@mongodb/loginappdb?authSource=admin"
```

Docker container can be built with
>`docker build . -t api`

### api-ts

Run npm install first time
>`npm i`

This is a Typescript implementation of the NodeJS / Express API, and needs compiling to Javascript, there's an npm script set up, just run
>`npm run build`

The compiled Javascript is output in `dist/`

A `.env` file is required in the root of api-ts
```
MODE="development"
PORT=3000
LOG_LEVEL="ALL"
USE_COMPRESSION=true
DISABLE_CORS=true
DB_CONNECTION="mongodb://bobdylan:tangledupinblue@mongodb/loginappdb?authSource=admin"
```

Docker container can be built with
>`docker build . -t api_ts`

### fe-server

Run npm install first time
>`npm i`

This is a Typescript NodeJS / Express server for serving the compiled front end assets ( index.html / css / javascript etc. ), and is required to host the front end in a separate `Kubernetes` pod.  It is not required for `docker-compose` where NGINX is used to serve the front end assets.

As it's Typescript, it'll need to be compiled to Javascript, just run
>`npm run build`

The frontend assets need to be copied into the public folder, it simply serves whatever is here as an Express static file.  Any assets that are not present, will result in index.html being served, this is to support SPA virtual routes ( ie hitting refresh on a virtual route will reserve index.html that should resolve the route ).

Docker container can be built with
>`docker build . -t fe_server`

### login-angular

Run npm install first time
>`npm i`

This is an Angular CLI project, and as such all the `ng` commands will work ( ie `ng build` etc. ).

The debug build is designed to work with the `docker-compose` set up ( ie `ng build` ), the env file expects the API to be available on `localhost`, whilst the production build ( `ng build --prod` ) is intended to work with `Kubernetes` and looks for the API in a domain ( app.com ).

Use the build CLI to generate artefacts in the `dist/` folder, copy these to the public folder of `fe-server` for a Kubernetes build, or edit the nginx config to server the `dist/` folder in place.

### login-reactts

Run npm install first time
>`npm i`

This is a custom React Typescript project with a local webpack config.  There are npm scripts to generate builds, run
>`npm run build`<br/>

will generate a production build in the `dist/` folder.

Currently the app is hardcoded to use the `app.com` domain, and as such is good for testing in the `Kubernetes` build.  Simply copy the build artefacts to the fe-server `public/` folder.

## Docker

Note, some systems ( like Linux ) may need you to use `sudo` to run `docker` or `docker-compose`.

### Build app locally ( debug version is set up for docker compose )

Build the Angular app, in the `login-angular` folder
>`ng build`

### Start docker

Start up docker
>`docker-compose up`

Use `--build` to force the containers to rebuild themselves<br/>
NOTE - this will reset the db
>`docker-compose up --build`

Docker runs in the foreground, so logs are visible during testing.
CTRL+C will essentially stop the server

### Stop docker

To stop docker, CTRL+C then run
>`docker-compose down`

### Testing

The app runs on port `8080`
>`http://localhost:8080`

## Kubernetes

### Start / Set Up Minikube

Start Minikube<br/>
>`minikube start`

Enable Ingress Addon ( only needs to be done once )
>`minikube addons enable ingress`<br/>

Verify with<br/>
>`kubectl get pods -n kube-system`<br/>

Can be slow to start

Switch Docker to Minikube repo, ensuring minikube is started first<br/>
>`eval $(minikube docker-env)`

Get minikube IP with
>`minikube ip`<br/>

Use this in your hosts file ( /etc/hosts ), associate the minikube ip with the domain name from the yaml ingress host ( app.com in our case - `- host: app.com` ), ie `192.168.99.100 app.com` ( where 192.168.99.100 is the ip returned by `minikube ip` )

### Build Docker images for pods

Build docker containers and upload to Minikube docker registry<br/>
Build API - From root of repo
>`cd api-ts`<br/>
>`npm run build`<br/>
>`docker image rm api_ts`<br/>
>`docker build . -t api_ts`<br/>

Build Front End ( Angular ) - From root of repo
>`cd login-angular`<br/>
>`ng build --prod`<br/>
>`cd ..`<br/>

Build Front End Server ( to serve Angular build ) - From root of repo<br/>
>`rm fe-server/public/*`<br/>
>`cp login-angular/dist/login-angular/* fe-server/public/`<br/>
>`cd fe-server`<br/>
>`npm run build`<br/>
>`docker image rm fe_server`<br/>
>`docker build . -t fe_server`

### Deploy / Test

Deploy to minikube
>`kubectl apply -f kubernetes.yaml`

List pods
>`kubectl get pods -n login`

Get pod log
>`kubectl logs ???? -n login`<br/>

Where ???? is the name of the pod as displayed by `get pods`

### Delete deployment

Delete deployment
>`kubectl delete namespace login`

### Stop / Shutdown Minikube

Stop Minikube<br/>
>`minikube stop`

### Testing

Shell into pod
>`kubectl -n login exec -it ???? bash`<br/>

Where ???? is the name of the pod as displayed by `get pods`

Shell into mongo container and connect to db
>`kubectl -n login exec -it ???? bash`<br/>

Where ???? is the name of the mongo pod as displayed by `get pods`<br/>

Then login to mongo locally to access the CLI
>`mongo -u bobdylan -p tangledupinblue`

### Generating Secrets

Generate username secret
>`echo -n "bobdylan" | base64`

Generate password secret
>`echo -n "tangledupinblue" | base64`
