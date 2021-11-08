package db

import (
	"time"

	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type RoomRepositoryImpl struct {
	collection *mgo.Collection
}

func NewRoomRepositoryImpl() *RoomRepositoryImpl {
	return &RoomRepositoryImpl{DB.C(models.Room{}.TableName())}
}

func (daoi RoomRepositoryImpl) CreateRoom(room *models.Room) error {
	room.CreatedAt = time.Now()
	room.UpdatedAt = time.Now()
	err := daoi.collection.Insert(room)
	return err
}

func (daoi RoomRepositoryImpl) GetRoomById(id string) (models.Room, error) {
	room := models.Room{}
	err := daoi.collection.Find(bson.M{"id": id}).One(&room)
	return room, err
}

func (daoi RoomRepositoryImpl) UpdateRoom(room *models.Room) error {
	room.UpdatedAt = time.Now()
	err := daoi.collection.Update(bson.M{"id": room.Id}, room)
	return err
}

func (daoi RoomRepositoryImpl) FindRooms(query bson.M) ([]models.Room, error) {
	var rooms []models.Room
	err := daoi.collection.Find(query).All(&rooms)
	return rooms, err
}
