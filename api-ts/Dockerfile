FROM node:dubnium

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY out/. .

EXPOSE 3000

CMD [ "npm", "run", "serve:docker" ]
