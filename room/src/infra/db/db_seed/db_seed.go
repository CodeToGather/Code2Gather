package db_seed

import (
	"log"

	"code2gather.com/room/src/infra/db"
)

func SeedDB() (err error) {
	err = db.ConnectoToDB()
	if err != nil {
		log.Fatalf("Error connecting to db: %v", err)
		return
	}
	defer db.CloseDBConnection()

	questionManager := db.NewQuestionDaoImpl()

	err = questionManager.ClearQuestions()
	if err != nil {
		log.Println(err)
	}

	for _, question := range GetSeedQuestions() {
		err = questionManager.CreateQuestion(question)
		if err != nil {
			log.Fatal(err)
			return
		}
	}
	return
}
