package main

import (
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/infra/db/db_seed"
	"code2gather.com/room/src/server/http"
)

func main() {
	err := db_seed.SeedDB()
	if err != nil {
		log.Fatalf("Error seeding db: %v", err)
		return
	}

	err = db.ConnectoToDB()
	if err != nil {
		log.Fatalf("Error connecting to db: %v", err)
		return
	}
	defer db.CloseDBConnection()

	http.StartHttpServer()
}
