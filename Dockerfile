FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build-only

EXPOSE 3000
CMD ["npm", "run", "start-migrate"]