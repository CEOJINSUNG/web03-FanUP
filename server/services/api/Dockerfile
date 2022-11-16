FROM node:18-alpine
WORKDIR /usr/src/server/services/api
COPY ./server/services/api .
RUN npm install
RUN npm run build
