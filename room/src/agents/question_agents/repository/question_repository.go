package repository

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2/bson"
)

type QuestionRepository interface {
	Add(question *models.Question) error
	Get(qid string) (models.Question, error)
	GetAll(query bson.M) ([]models.Question, error)
}
