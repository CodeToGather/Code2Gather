FROM golang:alpine AS build

ENV GO111MODULE=on

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

RUN go build -o /docker-gs-ping ./src

ENTRYPOINT ["/docker-gs-ping"]
