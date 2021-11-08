# First image is for building the client files
FROM node:14.17-alpine as build

WORKDIR /app

COPY . .

RUN yarn install

ENV DISABLE_ESLINT_PLUGIN=true
RUN yarn build

# Second image is for serving the files
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
