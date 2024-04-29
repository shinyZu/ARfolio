FROM node:10.16.3
WORKDIR /app
COPY package*.json ./

USER root

RUN npm install
COPY . .
EXPOSE 4001

CMD ["npm", "start"]