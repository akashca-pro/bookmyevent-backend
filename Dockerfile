#stage 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN node dist/scripts/generate-swagger.js

#stage 2 : runtime

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist /app
COPY --from=builder /app/swagger.json /app/swagger.json
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 9000 

CMD [ "node" , "index.js" ]