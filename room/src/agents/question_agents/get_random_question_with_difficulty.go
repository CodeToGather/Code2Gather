package question_agents

import (
	"math/rand"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

func GetRandomQuestionWithDifficulty(difficulty models.QuestionDifficultyLevel) (question models.Question, err error) {
	questionManager := db.NewQuestionManager()

	questions, err := questionManager.GetQuestionsWithDifficulty(difficulty)
	if err == nil {
		question = questions[rand.Intn(len(questions))]
	}

	return question, err
}
