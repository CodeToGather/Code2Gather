package db

import (
	"log"

	"gopkg.in/mgo.v2"
)

var DBSession *mgo.Session
var DB *mgo.Database

func ConnectoToDB() error {
	log.Print("Connecting to MongoDB ...")
	DBSession, err := mgo.Dial(DBUrl)
	if err != nil {
		log.Print("Error opening the connection:", err.Error())
		return err
	}

	// Optional. Switch the DBSession to a monotonic behavior.
	DBSession.SetMode(mgo.Monotonic, true)

	DB = DBSession.DB(DBName)

	return nil
}

func CloseDBConnection() {
	log.Print("Closing MongoDB ...")
	if DBSession != nil {
		DBSession.Close()
	}
}
