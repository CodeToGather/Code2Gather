package dao

import (
	"gopkg.in/mgo.v2/bson"

	"code2gather.com/room/src/models"
)

type RoomDAO interface {
	CreateRoom(room *models.Room) error
	GetRoomById(id string) (models.Room, error)
	UpdateRoom(room *models.Room) error
	FindRooms(query bson.M) ([]models.Room, error)
}
