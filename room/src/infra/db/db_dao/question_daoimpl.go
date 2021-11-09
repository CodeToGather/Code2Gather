package db_dao

import (
	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type QuestionDAOImpl struct {
	collection *mgo.Collection
}

func NewQuestionDAOImpl() *QuestionDAOImpl {
	return &QuestionDAOImpl{db.DB.C(models.Question{}.TableName())}
}

func (daoi QuestionDAOImpl) CreateQuestion(question *models.Question) error {
	err := daoi.collection.Insert(question)
	return err
}

func (daoi QuestionDAOImpl) GetQuestionById(id string) (models.Question, error) {
	question := models.Question{}
	err := daoi.collection.Find(bson.M{"id": id}).One(&question)
	return question, err

}

func (daoi QuestionDAOImpl) GetQuestionsWithDifficulty(difficulty models.QuestionDifficulty) ([]models.Question, error) {
	var questions []models.Question
	err := daoi.collection.Find(bson.M{"difficulty": difficulty}).All(&questions)
	return questions, err
}

func (daoi RoomDAOImpl) FindQuestions(query bson.M) ([]models.Question, error) {
	var questions []models.Question
	err := daoi.collection.Find(query).All(&questions)
	return questions, err
}

func (daoi QuestionDAOImpl) ClearQuestions() error {
	err := daoi.collection.DropCollection()
	return err
}
