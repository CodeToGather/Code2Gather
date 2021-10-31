package room_agents

import (
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

func GetRoomById(id string) (*models.Room, error) {
	roomDaoImpl := db.NewRoomDaoImpl()
	room, err := roomDaoImpl.GetRoomById(id)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &room, err
}
