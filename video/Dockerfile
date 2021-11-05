FROM node:14.17-alpine AS build

WORKDIR /app

RUN yarn global add @vercel/ncc pm2

COPY . /app

RUN yarn install --silent

RUN ncc build ./index.js

ENV PATH /app/node_modules/.bin:$PATH

CMD ["pm2-runtime", "start", "dist/index.js"]
