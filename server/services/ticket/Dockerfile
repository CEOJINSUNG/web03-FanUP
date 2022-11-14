FROM node:18
WORKDIR /server/services/ticket
COPY package*.json ./
RUN npm install
COPY . .
CMD npm start:prod