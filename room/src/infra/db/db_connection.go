package db

import (
	"log"

	"gopkg.in/mgo.v2"
)

var DBSession *mgo.Session
var QuestionCollection *mgo.Collection

func ConnectoToDB() error {
	log.Print("Connecting to MongoDB ...")
	session, err := mgo.Dial(DBUrl)
	if err != nil {
		log.Print("Error opening the connection:", err.Error())
		return err
	}

	// Optional. Switch the DBSession to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	QuestionCollection = session.DB(DBName).C(QuestionCollectionName)

	return nil

	//err = c.Insert(&Person{"Ale", "+55 53 8116 9639"},
	//	&Person{"Cla", "+55 53 8402 8510"})
	//if err != nil {
	//	log.Fatal(err)
	//}
	//
	//result := Person{}
	//err = c.Find(bson.M{"name": "Ale"}).One(&result)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//
	//fmt.Println("Phone:", result.Phone)
}

func CloseDBConnection() {
	DBSession.Close()
}
