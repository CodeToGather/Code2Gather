package room_agents

import (
	"code2gather.com/room/src/infra/db"
	"log"

	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/models"
)

func CreateRoom(uid1 string, uid2 string, difficulty models.QuestionDifficulty) (*models.Room, error) {
	newRoom := models.NewRoom()
	newRoom.Uid1 = uid1
	newRoom.Uid2 = uid2

	questions, err := question_agents.GetRandomQuestionsWithDifficulty(difficulty)

	if err != nil {
		log.Fatal(err)
		return newRoom, err
	}

	newRoom.Qid1 = questions[0].Id
	newRoom.Qid2 = questions[1].Id

	roomDaoImpl := db.NewRoomDaoImpl()
	err = roomDaoImpl.CreateRoom(newRoom)
	if err != nil {
		log.Fatal(err)
		return newRoom, err
	}

	return newRoom, err
}
