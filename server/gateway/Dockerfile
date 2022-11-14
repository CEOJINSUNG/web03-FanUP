FROM node:18
WORKDIR /server/gateway
COPY package*.json ./
RUN npm install
COPY . .
CMD npm start:prod