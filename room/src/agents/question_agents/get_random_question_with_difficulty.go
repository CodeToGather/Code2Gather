package question_agents

import (
	"math/rand"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

func GetRandomQuestionsWithDifficulty(difficulty models.QuestionDifficulty) (questions []models.Question, err error) {
	questionDaoImpl := db.NewQuestionDaoImpl()
	allQuestions, err := questionDaoImpl.GetQuestionsWithDifficulty(difficulty)

	if err != nil {
		return
	}

	totalQuestionCount := len(allQuestions)
	idx1, idx2 := getRandomIntInRange(totalQuestionCount), getRandomIntInRange(totalQuestionCount)

	for idx1 == idx2 {
		idx2 = getRandomIntInRange(totalQuestionCount)
	}

	questions = append(questions, allQuestions[idx1], allQuestions[idx2])
	return
}

func getRandomIntInRange(n int) int {
	return rand.Intn(n)
}
