FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["sh","-c","npx prisma migrate deploy && npm start"]