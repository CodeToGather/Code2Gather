package room_agents

import (
	"log"

	"code2gather.com/room/src/agents/room_agents/repository"
	"code2gather.com/room/src/models"
)

func GetRoomById(id string) (*models.Room, error) {
	repo := repository.NewRoomRepositoryImpl()
	room, err := repo.Get(id)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &room, err
}
