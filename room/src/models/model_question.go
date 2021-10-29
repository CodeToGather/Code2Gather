package models

import "github.com/google/uuid"

type Question struct {
	Id         string             `json:"id"`
	Title      string             `json:"title"`
	Text       string             `json:"text"`
	Difficulty QuestionDifficulty `json:"difficulty"`
	Hints      string             `json:"hints"`
}

func NewQuestion() *Question {
	return &Question{Id: uuid.New().String()}
}

func (Question) TableName() string {
	return "questions"
}
