package room_agents

import (
	"gopkg.in/mgo.v2/bson"
	"log"

	"code2gather.com/room/src/agents/room_agents/repository"
	"code2gather.com/room/src/models"
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
	repo := repository.NewRoomRepositoryImpl()
	query := bson.M{"$and": []bson.M{{"$or": []bson.M{{"uid1": uid}, {"uid2": uid}}},
		{"status": bson.M{"$ne": models.Closed}}}}
	return repo.GetAll(query)
}
