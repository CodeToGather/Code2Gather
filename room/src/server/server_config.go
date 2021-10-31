package server

import "os"

const ConnHost = "localhost"

var ConnPort = os.Getenv("PORT")
