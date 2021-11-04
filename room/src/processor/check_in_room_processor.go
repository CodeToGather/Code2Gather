package processor

import (
	"log"

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

func (p *CheckInRoomProcessor) Process() error {
	log.Println("Processing Check In Room Request")

	//room, err := room_agents.CreateRoom(p.request.GetUid1(), p.request.GetUid2(), p.request.GetDifficulty())
	//if room != nil {
	//	p.roomId = room.Id
	//}
	return nil
}

func (p *CheckInRoomProcessor) GetResponse() proto.Message {
	resp := models.CheckInRoomResponse{
		IsInRoom: p.isInRoom,
		RoomId:   p.roomId,
	}
	return &resp
}
