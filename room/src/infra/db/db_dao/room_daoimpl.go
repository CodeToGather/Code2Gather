package db_dao

import (
	"code2gather.com/room/src/infra/db"
	"time"

	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type RoomDAOImpl struct {
	collection *mgo.Collection
}

func NewRoomDAOImpl() *RoomDAOImpl {
	return &RoomDAOImpl{db.DB.C(models.Room{}.TableName())}
}

func (daoi RoomDAOImpl) CreateRoom(room *models.Room) error {
	room.CreatedAt = time.Now()
	room.UpdatedAt = time.Now()
	err := daoi.collection.Insert(room)
	return err
}

func (daoi RoomDAOImpl) GetRoomById(id string) (models.Room, error) {
	room := models.Room{}
	err := daoi.collection.Find(bson.M{"id": id}).One(&room)
	return room, err
}

func (daoi RoomDAOImpl) UpdateRoom(room *models.Room) error {
	room.UpdatedAt = time.Now()
	err := daoi.collection.Update(bson.M{"id": room.Id}, room)
	return err
}

func (daoi RoomDAOImpl) FindRooms(query bson.M) ([]models.Room, error) {
	var rooms []models.Room
	err := daoi.collection.Find(query).All(&rooms)
	return rooms, err
}
