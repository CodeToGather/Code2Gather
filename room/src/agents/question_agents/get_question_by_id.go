package question_agents

import (
	"code2gather.com/room/src/agents/question_agents/repository"
	"code2gather.com/room/src/models"
)

func GetQuestionById(id string) (*models.Question, error) {
	repo := repository.NewQuestionRepositoryImpl()
	question, err := repo.Get(id)
	if err != nil {
		return nil, err
	}

	return &question, err
}
