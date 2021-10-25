package db

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var QuestionCollection *mgo.Collection

type QuestionManager struct {
}

func NewQuestionManager() *QuestionManager {
	QuestionCollection = DB.C(models.Question{}.TableName())
	return &QuestionManager{}
}

func (m QuestionManager) CreateQuestion(question *models.Question) error {
	err := QuestionCollection.Insert(question)
	return err
}

func (m QuestionManager) GetQuestionById(id string) (models.Question, error) {
	question := models.Question{}
	err := QuestionCollection.FindId(id).One(&question)
	return question, err

}

func (m QuestionManager) GetQuestionsWithDifficulty(difficulty models.QuestionDifficultyLevel) ([]models.Question, error) {
	var questions []models.Question
	err := QuestionCollection.Find(bson.M{"difficulty_level": difficulty.String()}).All(&questions)
	return questions, err
}
