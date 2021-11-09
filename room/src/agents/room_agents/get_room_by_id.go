package room_agents

import (
	"code2gather.com/room/src/infra/db/db_dao"
	"log"

	"code2gather.com/room/src/models"
)

func GetRoomById(id string) (*models.Room, error) {
	roomDaoImpl := db_dao.NewRoomDAOImpl()
	room, err := roomDaoImpl.GetRoomById(id)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &room, err
}
