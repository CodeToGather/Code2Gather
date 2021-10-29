package db

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var QuestionCollection *mgo.Collection

type QuestionDaoImpl struct {
}

func NewQuestionDAOImpl() *QuestionDaoImpl {
	QuestionCollection = DB.C(models.Question{}.TableName())
	return &QuestionDaoImpl{}
}

func (m QuestionDaoImpl) CreateQuestion(question *models.Question) error {
	err := QuestionCollection.Insert(question)
	return err
}

func (m QuestionDaoImpl) GetQuestionById(id string) (models.Question, error) {
	question := models.Question{}
	err := QuestionCollection.Find(bson.M{"id": id}).One(&question)
	return question, err

}

func (m QuestionDaoImpl) GetQuestionsWithDifficulty(difficulty models.QuestionDifficulty) ([]models.Question, error) {
	var questions []models.Question
	err := QuestionCollection.Find(bson.M{"difficulty": difficulty}).All(&questions)
	return questions, err
}

func (m QuestionDaoImpl) ClearQuestions() error {
	err := QuestionCollection.DropCollection()
	return err
}
