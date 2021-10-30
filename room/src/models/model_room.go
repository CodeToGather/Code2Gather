package models

import "github.com/google/uuid"

type RoomStatus int32

const (
	FirstQuestion RoomStatus = iota
	SecondQuestion
	Completed
	Closed
)

type Room struct {
	Id     string     `json:"id"`
	Uid1   string     `json:"uid1"`
	Uid2   string     `json:"uid2"`
	Qid1   string     `json:"qid1"`
	Qid2   string     `json:"qid2"`
	Status RoomStatus `json:"status"`
}

func NewRoom() *Room {
	return &Room{Id: uuid.New().String()}
}

func (Room) TableName() string {
	return "rooms"
}
