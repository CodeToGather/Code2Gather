package db

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type QuestionDaoImpl struct {
	collection *mgo.Collection
}

func NewQuestionDaoImpl() *QuestionDaoImpl {
	return &QuestionDaoImpl{DB.C(models.Question{}.TableName())}
}

func (daoi QuestionDaoImpl) CreateQuestion(question *models.Question) error {
	err := daoi.collection.Insert(question)
	return err
}

func (daoi QuestionDaoImpl) GetQuestionById(id string) (models.Question, error) {
	question := models.Question{}
	err := daoi.collection.Find(bson.M{"id": id}).One(&question)
	return question, err

}

func (daoi QuestionDaoImpl) GetQuestionsWithDifficulty(difficulty models.QuestionDifficulty) ([]models.Question, error) {
	var questions []models.Question
	err := daoi.collection.Find(bson.M{"difficulty": difficulty}).All(&questions)
	return questions, err
}

func (daoi QuestionDaoImpl) ClearQuestions() error {
	err := daoi.collection.DropCollection()
	return err
}
