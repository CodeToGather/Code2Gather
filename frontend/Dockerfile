# First image is for building the client files
FROM node:14.17-alpine as build

ENV SKIP_PREFLIGHT_CHECK 'true'
ENV REACT_APP_BACKEND_API https://api.code2gather.io
ENV REACT_APP_BACKEND_WS_API wss://api.code2gather.io
ENV REACT_APP_FIREBASE_API_KEY AIzaSyASaqw4fLp2DYyfmVRfQojpXcvFzlcVKs8
ENV REACT_APP_FIREBASE_AUTH_DOMAIN code2gather-df5c6.firebaseapp.com
ENV REACT_APP_FIREBASE_PROJECT_ID code2gather-df5c6
ENV REACT_APP_FIREBASE_STORAGE_BUCKET code2gather-df5c6.appspot.com
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID 333844889339
ENV REACT_APP_FIREBASE_APP_ID 1:333844889339:web:e8aee02dd38ceceefd3a5e
ENV REACT_APP_FIREBASE_MEASUREMENT_ID G-MFN27CTW6J
ENV REACT_APP_AGORA_APP_ID 6e61da63d86d4d96951c2d27054273b1

WORKDIR /app

COPY . .

RUN yarn install

ENV DISABLE_ESLINT_PLUGIN=true
RUN yarn build

# Second image is for serving the files
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80 443 3999

CMD ["nginx", "-g", "daemon off;"]
