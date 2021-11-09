package repository

import (
	"gopkg.in/mgo.v2/bson"

	"code2gather.com/room/src/dao"
	"code2gather.com/room/src/infra/db/db_dao"
	"code2gather.com/room/src/models"
)

type QuestionRepositoryImpl struct {
	dao dao.QuestionDAO
}

func NewQuestionRepositoryImpl() *QuestionRepositoryImpl {
	return &QuestionRepositoryImpl{dao: db_dao.NewQuestionDAOImpl()}
}

func (r QuestionRepositoryImpl) Add(question *models.Question) error {
	return r.dao.CreateQuestion(question)
}

func (r QuestionRepositoryImpl) Get(qid string) (models.Question, error) {
	return r.dao.GetQuestionById(qid)
}

func (r QuestionRepositoryImpl) GetAll(query bson.M) ([]models.Question, error) {
	return r.dao.FindQuestions(query)
}
