package db

import "os"

const DBName = "code2gather_dev"

var DBUrl = os.Getenv("MONGODB_URL")
