package models

type QuestionDifficultyLevel int

const (
	Easy QuestionDifficultyLevel = iota
	Medium
	Hard
)

func (d QuestionDifficultyLevel) String() string {
	switch d {
	case Easy:
		return "Easy"
	case Medium:
		return "Medium"
	case Hard:
		return "Hard"
	}
	return "Unknown"
}

type Question struct {
	QuestionId      string `json:"uuid"`
	QuestionTitle   string `json:"question_title"`
	QuestionText    string `json:"question_text"`
	DifficultyLevel string `json:"difficulty_level"`
	QuestionHints   string `json:"question_hints"`
}

func (Question) TableName() string {
	return "questions"
}
