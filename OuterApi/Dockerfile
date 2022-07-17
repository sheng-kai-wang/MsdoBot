# reference: https://nodejs.org/zh-tw/docs/guides/nodejs-docker-webapp/
# maybe check zh-cn version for chinese docs

FROM node:16.16.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 10001
CMD [ "npm", "start" ]