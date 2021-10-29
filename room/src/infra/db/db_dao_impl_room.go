package db

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type RoomDaoImpl struct {
	collection *mgo.Collection
}

func NewRoomDaoImpl() *RoomDaoImpl {
	return &RoomDaoImpl{DB.C(models.Room{}.TableName())}
}

func (daoi RoomDaoImpl) CreateRoom(room *models.Room) error {
	err := daoi.collection.Insert(room)
	return err
}

func (daoi RoomDaoImpl) GetRoomById(id string) (models.Room, error) {
	room := models.Room{}
	err := daoi.collection.Find(bson.M{"id": id}).One(&room)
	return room, err
}
