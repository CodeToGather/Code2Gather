package main

import (
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/server"
)

func main() {
	err := db.ConnectoToDB()
	if err != nil {
		log.Fatalf("Error connecting to db: %v", err)
		return
	}
	defer db.CloseDBConnection()

	server.StartServer()
}
