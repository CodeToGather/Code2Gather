package question_agents

import (
	"code2gather.com/room/src/infra/db/db_dao"
	"math/rand"

	"code2gather.com/room/src/models"
)

func GetRandomQuestionsWithDifficulty(difficulty models.QuestionDifficulty) (question1 models.Question, question2 models.Question, err error) {
	questionDaoImpl := db_dao.NewQuestionDAOImpl()
	allQuestions, err := questionDaoImpl.GetQuestionsWithDifficulty(difficulty)

	if err != nil {
		return
	}

	totalQuestionCount := len(allQuestions)
	idx1, idx2 := getRandomIntInRange(totalQuestionCount), getRandomIntInRange(totalQuestionCount)

	for idx1 == idx2 {
		idx2 = getRandomIntInRange(totalQuestionCount)
	}

	question1 = allQuestions[idx1]
	question2 = allQuestions[idx2]
	return
}

func getRandomIntInRange(n int) int {
	return rand.Intn(n)
}
