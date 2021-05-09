FROM node:14

RUN Run mkdir -p /app

WORKDIR /app

RUN npm install

COPY app.js .

EXPOSE 3000

CMD [ "npm", "start" ]