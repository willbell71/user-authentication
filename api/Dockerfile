FROM node:dubnium

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY ./src ./src
COPY ./.env .
COPY ./process.yml .

EXPOSE 3000

CMD [ "npm", "run", "serve:docker" ]
