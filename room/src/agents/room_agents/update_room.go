package room_agents

import (
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
)

func UpdateRoom(room *models.Room) error {
	roomDaoImpl := db.NewRoomDaoImpl()
	err := roomDaoImpl.UpdateRoom(room)
	if err != nil {
		log.Println(err)
	}
	return err
}
