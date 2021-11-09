package room_agents

import (
	"log"
	"math/rand"

	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/agents/room_agents/repository"
	"code2gather.com/room/src/models"
)

func CreateRoom(uid1 string, uid2 string, difficulty models.QuestionDifficulty) (*models.Room, error) {
	newRoom := models.NewRoom()

	randNumber := rand.Intn(2)
	if randNumber == 0 {
		newRoom.Uid1 = uid1
		newRoom.Uid2 = uid2
	} else {
		newRoom.Uid1 = uid2
		newRoom.Uid2 = uid1
	}

	question1, question2, err := question_agents.GetRandomQuestionsWithDifficulty(difficulty)

	if err != nil {
		log.Fatal(err)
		return newRoom, err
	}

	newRoom.Qid1 = question1.Id
	newRoom.Qid2 = question2.Id

	repo := repository.NewRoomRepositoryImpl()
	err = repo.Add(newRoom)
	if err != nil {
		log.Fatal(err)
		return newRoom, err
	}

	return newRoom, err
}
