FROM node:14.18-alpine3.14

WORKDIR /usr/client/

COPY ./ ./

RUN npm install && npm run build

EXPOSE 5000

CMD [ "npm", "run", "preview" ]
