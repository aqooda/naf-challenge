FROM node:14.18-alpine3.14

WORKDIR /usr/server/

COPY ./ ./

RUN npm install && npm run build

CMD [ "node", "dist/main" ]
