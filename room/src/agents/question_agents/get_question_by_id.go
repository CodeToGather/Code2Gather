package question_agents

import (
	"code2gather.com/room/src/infra/db/db_dao"
	"code2gather.com/room/src/models"
)

func GetQuestionById(id string) (*models.Question, error) {
	questionDaoImpl := db_dao.NewQuestionDAOImpl()
	question, err := questionDaoImpl.GetQuestionById(id)
	if err != nil {
		return nil, err
	}

	return &question, err
}
