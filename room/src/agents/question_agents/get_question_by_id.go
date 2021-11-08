package question_agents

import (
	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

func GetQuestionById(id string) (*models.Question, error) {
	questionDaoImpl := db.NewQuestionRepositoryImpl()
	question, err := questionDaoImpl.GetQuestionById(id)
	if err != nil {
		return nil, err
	}

	return &question, err
}
