package room_agents

import (
	"code2gather.com/room/src/infra/db/db_dao"
	"log"

	"code2gather.com/room/src/models"
)

func UpdateRoom(room *models.Room) error {
	roomDaoImpl := db_dao.NewRoomDAOImpl()
	err := roomDaoImpl.UpdateRoom(room)
	if err != nil {
		log.Println(err)
	}
	return err
}
