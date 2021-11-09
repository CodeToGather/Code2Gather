package repository

import (
	"code2gather.com/room/src/models"
	"gopkg.in/mgo.v2/bson"
)

type RoomRepository interface {
	Add(room *models.Room) error
	Get(rid string) (models.Room, error)
	GetAll(query bson.M) ([]models.Room, error)
	Update(room *models.Room) error
}
