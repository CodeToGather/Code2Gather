package dao

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2/bson"
)

type QuestionDAO interface {
	CreateQuestion(question *models.Question) error
	GetQuestionById(id string) (models.Question, error)
	FindQuestions(query bson.M) ([]models.Question, error)
	ClearQuestions() error
}
