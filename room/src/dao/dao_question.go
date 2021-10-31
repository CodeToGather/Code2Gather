package dao

import "code2gather.com/room/src/models"

type QuestionDAO interface {
	CreateQuestion(question *models.Question) error
	GetQuestionById(id string) (models.Question, error)
	GetQuestionsWithDifficulty(difficulty models.QuestionDifficulty) ([]models.Question, error)
	ClearQuestions() error
}
