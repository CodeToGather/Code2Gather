package repository

import (
	"gopkg.in/mgo.v2/bson"

	"code2gather.com/room/src/dao"
	"code2gather.com/room/src/infra/db/db_dao"
	"code2gather.com/room/src/models"
)

type RoomRepositoryImpl struct {
	dao dao.RoomDAO
}

func NewRoomRepositoryImpl() *RoomRepositoryImpl {
	return &RoomRepositoryImpl{dao: db_dao.NewRoomDAOImpl()}
}

func (r RoomRepositoryImpl) Add(room *models.Room) error {
	return r.dao.CreateRoom(room)
}

func (r RoomRepositoryImpl) Get(rid string) (models.Room, error) {
	return r.dao.GetRoomById(rid)
}

func (r RoomRepositoryImpl) GetAll(query bson.M) ([]models.Room, error) {
	return r.dao.FindRooms(query)
}

func (r RoomRepositoryImpl) Update(room *models.Room) error {
	return r.dao.UpdateRoom(room)
}
