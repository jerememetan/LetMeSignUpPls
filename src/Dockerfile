FROM node:22 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","run","dev"]
