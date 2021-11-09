package room_agents

import (
	"log"

	"code2gather.com/room/src/agents/room_agents/repository"
	"code2gather.com/room/src/models"
)

func UpdateRoom(room *models.Room) error {
	repo := repository.NewRoomRepositoryImpl()
	err := repo.Update(room)
	if err != nil {
		log.Println(err)
	}
	return err
}
