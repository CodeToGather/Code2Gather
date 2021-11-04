package processor

import (
	"log"

	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"github.com/golang/protobuf/proto"
)

type CheckInRoomProcessor struct {
	uid      string
	isInRoom bool
	roomId   string
}

func NewCheckInRoomProcessor(uid string) *CheckInRoomProcessor {
	return &CheckInRoomProcessor{uid: uid}
}

func (p *CheckInRoomProcessor) GetRequest() proto.Message {
	return nil
}

func (p *CheckInRoomProcessor) Process() (err error) {
	log.Println("Processing Check In Room Request")
	p.isInRoom, p.roomId, err = room_agents.CheckUserInRoom(p.uid)
	return err
}

func (p *CheckInRoomProcessor) GetResponse() proto.Message {
	resp := models.CheckInRoomResponse{
		IsInRoom: p.isInRoom,
		RoomId:   p.roomId,
	}
	return &resp
}
