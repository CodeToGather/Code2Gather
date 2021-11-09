package question_agents

import (
	"gopkg.in/mgo.v2/bson"
	"math/rand"

	"code2gather.com/room/src/agents/question_agents/repository"
	"code2gather.com/room/src/models"
)

func GetRandomQuestionsWithDifficulty(difficulty models.QuestionDifficulty) (question1 models.Question, question2 models.Question, err error) {
	repo := repository.NewQuestionRepositoryImpl()

	allQuestions, err := repo.GetAll(bson.M{"difficulty": difficulty})

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
