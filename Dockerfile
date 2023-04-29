FROM node:18.15-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

COPY . .

EXPOSE 9000

CMD [ "pm2-runtime", "index.js" ]
