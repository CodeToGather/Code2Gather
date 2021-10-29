package dao

import "code2gather.com/room/src/models"

type RoomDAO interface {
	CreateRoom(room *models.Room) error
	GetRoomById(id string) (models.Room, error)
}
