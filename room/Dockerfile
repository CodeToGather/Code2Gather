# Step 1: Build
FROM golang:alpine AS builder

ENV GO111MODULE=on

WORKDIR /app

COPY . .
RUN go mod download
RUN go mod verify

RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/hello ./src

# Step 2: Run on a small image
FROM scratch

COPY --from=builder /go/bin/hello /go/bin/hello

ENTRYPOINT ["/go/bin/hello"]
