# First image is for building the client files
FROM node:14.17-alpine as build

RUN mkdir -p /home/node/app

WORKDIR /home/node/app/

COPY .eslintignore .
COPY .eslintrc.js .
COPY tsconfig.eslint.json .
COPY package.json .
COPY yarn.lock .

WORKDIR /home/node/app/frontend
COPY ./frontend .

RUN yarn install && yarn build

# Second image is for serving the files
FROM nginx:stable-alpine

COPY --from=build /home/node/app/frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
