FROM node:14.17-alpine AS build

WORKDIR /app

RUN yarn global add @vercel/ncc pm2

COPY . .

RUN yarn install --silent

# This is ok because we don't have any paths to replace in `coding`
RUN ncc build src/index.ts

ENV PATH /app/node_modules/.bin:$PATH

CMD ["pm2-runtime", "start", "dist/index.js"]
