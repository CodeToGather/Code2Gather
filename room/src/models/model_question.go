package models

type QuestionDifficultyLevel int

const (
	Easy QuestionDifficultyLevel = iota
	Medium
	Hard
)

func GetQuestionDifficultyLevel(difficulty string) (d QuestionDifficultyLevel, err error) {
	switch difficulty {
	case Easy.String():
		d = Easy
	case Medium.String():
		d = Medium
	case Hard.String():
		d = Hard
	default:
		// TODO: return error
		return
	}
	return
}

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
	QuestionId      string                  `json:"question_id"`
	QuestionTitle   string                  `json:"question_title"`
	QuestionText    string                  `json:"question_text"`
	DifficultyLevel QuestionDifficultyLevel `json:"difficulty_level"`
	QuestionHints   string                  `json:"question_hints"`
}

func (Question) TableName() string {
	return "questions"
}
