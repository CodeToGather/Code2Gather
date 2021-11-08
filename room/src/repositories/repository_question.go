package repositories

import "code2gather.com/room/src/models"

type QuestionRepository interface {
	CreateQuestion(question *models.Question) error
	GetQuestionById(id string) (models.Question, error)
	GetQuestionsWithDifficulty(difficulty models.QuestionDifficulty) ([]models.Question, error)
	ClearQuestions() error
}
