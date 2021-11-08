package db

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type QuestionRepositoryImpl struct {
	collection *mgo.Collection
}

func NewQuestionRepositoryImpl() *QuestionRepositoryImpl {
	return &QuestionRepositoryImpl{DB.C(models.Question{}.TableName())}
}

func (daoi QuestionRepositoryImpl) CreateQuestion(question *models.Question) error {
	err := daoi.collection.Insert(question)
	return err
}

func (daoi QuestionRepositoryImpl) GetQuestionById(id string) (models.Question, error) {
	question := models.Question{}
	err := daoi.collection.Find(bson.M{"id": id}).One(&question)
	return question, err

}

func (daoi QuestionRepositoryImpl) GetQuestionsWithDifficulty(difficulty models.QuestionDifficulty) ([]models.Question, error) {
	var questions []models.Question
	err := daoi.collection.Find(bson.M{"difficulty": difficulty}).All(&questions)
	return questions, err
}

func (daoi QuestionRepositoryImpl) ClearQuestions() error {
	err := daoi.collection.DropCollection()
	return err
}
