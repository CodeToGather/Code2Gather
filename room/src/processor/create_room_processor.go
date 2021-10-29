package processor

import (
	"log"

	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"github.com/golang/protobuf/proto"
)

type RoomCreationProcessor struct {
	request *models.CreateRoomRequest
	roomId  string
}

func NewRoomCreationProcessor() *RoomCreationProcessor {
	return &RoomCreationProcessor{request: &models.CreateRoomRequest{}}
}

func (p *RoomCreationProcessor) GetRequest() proto.Message {
	return p.request
}

func (p *RoomCreationProcessor) Process() error {
	log.Println("Processing create room request")
	room, err := room_agents.CreateRoom(p.request.GetUid1(), p.request.GetUid2(), p.request.GetDifficulty())
	if room != nil {
		p.roomId = room.Id
	}
	return err
}

func (p *RoomCreationProcessor) GetResponse() proto.Message {
	resp := models.CreateRoomResponse{RoomId: p.roomId}
	return &resp
}
