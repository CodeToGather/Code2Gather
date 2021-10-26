package question_agents

import (
	"math/rand"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

func GetRandomQuestionsWithDifficulty(difficulty models.QuestionDifficultyLevel, numOfQuestions int) ([]models.Question, error) {
	var questions [2]models.Question

	questionManager := db.NewQuestionManager()
	allQuestions, err := questionManager.GetQuestionsWithDifficulty(difficulty)

	if err != nil {
		return questions[:], err
	}

	// TODO: replace with unique random generator
	// remove questions attempted by user
	for i := 0; i < numOfQuestions; i++ {
		questions[i] = allQuestions[rand.Intn(len(allQuestions))]
	}

	return questions[:], err
}
