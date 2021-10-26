package main

import (
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

var questionSeeds []*models.Question

func init() {
	questionSeeds = []*models.Question{
		{
			QuestionTitle:   "easy_1",
			QuestionText:    "easy question 1",
			DifficultyLevel: models.Easy,
			QuestionHints:   "some hints",
		},
		{
			QuestionTitle:   "easy_2",
			QuestionText:    "easy question 2",
			DifficultyLevel: models.Easy,
			QuestionHints:   "some hints",
		},
		{
			QuestionTitle:   "medium_1",
			QuestionText:    "medium question 1",
			DifficultyLevel: models.Medium,
			QuestionHints:   "some hints",
		},
		{
			QuestionTitle:   "medium_2",
			QuestionText:    "medium question 2",
			DifficultyLevel: models.Medium,
			QuestionHints:   "some hints",
		},
		{
			QuestionTitle:   "hard_1",
			QuestionText:    "hard question 1",
			DifficultyLevel: models.Hard,
			QuestionHints:   "some hints",
		},
		{
			QuestionTitle:   "hard_2",
			QuestionText:    "hard question 2",
			DifficultyLevel: models.Hard,
			QuestionHints:   "some hints",
		},
	}
}

func main() {
	var err error
	err = db.ConnectoToDB()
	if err != nil {
		log.Fatalf("Error connecting to db: %v", err)
		return
	}
	defer db.CloseDBConnection()

	questionManager := db.NewQuestionManager()

	err = questionManager.ClearQuestions()
	if err != nil {
		log.Fatal(err)
	}

	for _, question := range questionSeeds {
		err = questionManager.CreateQuestion(question)
		if err != nil {
			log.Fatal(err)
		}
	}
}
