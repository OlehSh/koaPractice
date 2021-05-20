FROM node:14.15.4-alpine

ARG PORT

ENV PORT=$PORT

WORKDIR /app

COPY package.json ./

RUN npm install

COPY  . .

RUN npm run build
# v7Y7jDibx27mVVufHqseUmjHBfdadw
EXPOSE $ARG_PORT

CMD [ "npm", "start" ]