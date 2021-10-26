package processor

import (
	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
)

type RoomCreationProcessor struct {
	Users      []string
	Difficulty models.QuestionDifficultyLevel
	Room       models.Room
}

func NewRoomCreationProcessor(users []string, difficulty string) *RoomCreationProcessor {
	difficultyLevel, _ := models.GetQuestionDifficultyLevel(difficulty)
	return &RoomCreationProcessor{Users: users, Difficulty: difficultyLevel}
}

func (p RoomCreationProcessor) Process() error {
	room, err := room_agents.CreateRoom(p.Users, p.Difficulty)
	if err == nil {
		p.Room = room
	}
	return err
}

func (p RoomCreationProcessor) GetResponse() {
	//json, err := json.Marshal(p.Room)
}
