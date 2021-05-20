FROM node:14.15.4-alpine

ARG PORT

ENV PORT=$PORT

WORKDIR /app

ADD package.json ./app/package.json

RUN npm install

ADD  . /app

RUN npm run build
# v7Y7jDibx27mVVufHqseUmjHBfdadw
EXPOSE $ARG_PORT

CMD [ "npm", "start" ]