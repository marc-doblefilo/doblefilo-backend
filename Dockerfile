FROM node:14

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD [ "node", "app.js"]