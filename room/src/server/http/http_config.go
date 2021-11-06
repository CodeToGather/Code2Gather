package http

import "os"

const ConnHost = "localhost"

var ConnPort = os.Getenv("PORT")
