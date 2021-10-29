package models

import "github.com/google/uuid"

type Room struct {
	Id   string `json:"id"`
	Uid1 string `json:"uid1"`
	Uid2 string `json:"uid2"`
	Qid1 string `json:"qid1"`
	Qid2 string `json:"qid2"`
}

func NewRoom() *Room {
	return &Room{Id: uuid.New().String()}
}

func (Room) TableName() string {
	return "rooms"
}
