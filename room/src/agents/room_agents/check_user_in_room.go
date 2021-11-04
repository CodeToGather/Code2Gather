package room_agents

import (
	"log"

	"code2gather.com/room/src/infra/db"
)

func CheckUserInRoom(uid string) (isInRoom bool, roomId string, err error) {
	roomDaoImpl := db.NewRoomDaoImpl()
	rooms, err := roomDaoImpl.GetActiveRoomOfUser(uid)
	if err != nil {
		log.Println(err)
		return
	}
	if len(rooms) == 0 {
		isInRoom = false
	} else {
		isInRoom = true
		roomId = rooms[0].Id
	}
	return
}
