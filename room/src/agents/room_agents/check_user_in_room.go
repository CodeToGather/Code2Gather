package room_agents

import (
	"log"

	"code2gather.com/room/src/infra/db"
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2/bson"
)

func CheckUserInRoom(uid string) (isInRoom bool, roomId string, err error) {
	rooms, err := getActiveRoomsOfUser(uid)
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

func getActiveRoomsOfUser(uid string) ([]models.Room, error) {
	roomDaoImpl := db.NewRoomRepositoryImpl()
	query := bson.M{"$and": []bson.M{{"$or": []bson.M{{"uid1": uid}, {"uid2": uid}}},
		{"status": bson.M{"$ne": models.Closed}}}}
	return roomDaoImpl.FindRooms(query)
}
