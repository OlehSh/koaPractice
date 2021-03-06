FROM node:14.15.4-alpine

ARG PORT
ARG SALT_ROUNDS
ARG NEO4J_PORT
ARG NEO4J_PASSWORD
ARG NEO4J_USER
ARG NEO4J_HOST
ARG NEO4J_DB_NAME
ARG AUTH_STRATEGY=local
ARG SECRET_KEY

ENV PORT=$PORT
ENV SALT_ROUNDS=$SALT_ROUNDS
ENV NEO4J_PORT=$NEO4J_PORT
ENV NEO4J_PASSWORD=$NEO4J_PASSWORD
ENV NEO4J_USER=$NEO4J_USER
ENV NEO4J_HOST=$NEO4J_HOST
ENV NEO4J_DB_NAME=$NEO4J_DB_NAME
ENV AUTH_STRATEGY=$AUTH_STRATEGY
ENV SECRET_KEY=$SECRET_KEY

WORKDIR /app

ADD package.json /app/package.json

RUN npm install

ADD  . /app

RUN npm run build

EXPOSE $ARG_PORT

CMD [ "npm", "start" ]