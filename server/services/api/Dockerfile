FROM node:18
WORKDIR /server/services/api
COPY package*.json ./
RUN npm install
COPY . .
CMD npm start:prod