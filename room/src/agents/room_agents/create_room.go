package room_agents

import (
	"log"

	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/models"
)

func CreateRoom(users []string, difficulty models.QuestionDifficultyLevel) (room models.Room, err error) {
	room.Users = users

	questions, err := question_agents.GetRandomQuestionsWithDifficulty(difficulty, len(users))

	if err != nil {
		log.Fatal(err)
		return
	}

	room.Questions = questions
	return
}
