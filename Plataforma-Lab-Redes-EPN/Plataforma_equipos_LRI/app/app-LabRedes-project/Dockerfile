FROM node:22-slim

WORKDIR /usr/src/app

copy package.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm","run","dev"]