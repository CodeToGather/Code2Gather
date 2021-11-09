package db_seed

import (
	"code2gather.com/room/src/infra/db/db_dao"
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

	daoimpl := db_dao.NewQuestionDAOImpl()

	err = daoimpl.ClearQuestions()
	if err != nil {
		log.Println(err)
	}

	for _, question := range GetSeedQuestions() {
		err = daoimpl.CreateQuestion(question)
		if err != nil {
			log.Fatal(err)
			return
		}
	}
	return
}
