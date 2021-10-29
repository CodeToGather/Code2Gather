package main

import (
	"github.com/google/uuid"
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

var questionSeeds []*models.Question

func init() {
	questionSeeds = []*models.Question{
		{
			Id:         uuid.New().String(),
			Title:      "easy_1",
			Text:       "easy question 1",
			Difficulty: models.QuestionDifficulty_EASY,
			Hints:      "some hints",
		},
		{
			Id:         uuid.New().String(),
			Title:      "easy_2",
			Text:       "easy question 2",
			Difficulty: models.QuestionDifficulty_EASY,
			Hints:      "some hints",
		},
		{
			Id:         uuid.New().String(),
			Title:      "medium_1",
			Text:       "medium question 1",
			Difficulty: models.QuestionDifficulty_MEDIUM,
			Hints:      "some hints",
		},
		{
			Id:         uuid.New().String(),
			Title:      "medium_2",
			Text:       "medium question 2",
			Difficulty: models.QuestionDifficulty_MEDIUM,
			Hints:      "some hints",
		},
		{
			Id:         uuid.New().String(),
			Title:      "medium_3",
			Text:       "medium question 3",
			Difficulty: models.QuestionDifficulty_MEDIUM,
			Hints:      "some hints",
		},
		{
			Id:         uuid.New().String(),
			Title:      "hard_1",
			Text:       "hard question 1",
			Difficulty: models.QuestionDifficulty_HARD,
			Hints:      "some hints",
		},
		{
			Id:         uuid.New().String(),
			Title:      "hard_2",
			Text:       "hard question 2",
			Difficulty: models.QuestionDifficulty_HARD,
			Hints:      "some hints",
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

	questionManager := db.NewQuestionDAOImpl()

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
