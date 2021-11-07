package processor

import (
	"log"

	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"github.com/golang/protobuf/proto"
)

type LeaveRoomProcessor struct {
	request    *models.LeaveRoomRequest
	uid        string
	rid        string
	ratedUid   string
	authorized bool
	err        error
}

func NewLeaveRoomProcessor(request *models.LeaveRoomRequest, uid string) *LeaveRoomProcessor {
	return &LeaveRoomProcessor{request: request, uid: uid, rid: request.GetRoomId()}
}

func (p *LeaveRoomProcessor) IsRequestAuthorized() bool {
	return p.authorized
}

func (p *LeaveRoomProcessor) GetRoomId() string {
	return p.rid
}

func (p *LeaveRoomProcessor) GetRequest() proto.Message {
	return p.request
}

func (p *LeaveRoomProcessor) Process() error {
	log.Println("Processing Leave Room Request")
	room, err := room_agents.GetRoomById(p.rid)
	if err != nil {
		p.err = err
		return err
	}
	if room.HasUser(p.uid) {
		p.authorized = true
	} else {
		return nil
	}

	// TODO: double closing of rooms?
	room.Status = models.Closed
	if err = room_agents.UpdateRoom(room); err != nil {
		p.err = err
		return err
	}
	return nil
}

func (p *LeaveRoomProcessor) GetResponse() proto.Message {
	errorCode := models.ErrorCode_NO_ERROR
	if p.err != nil {
		log.Println(p.err)
		errorCode = models.ErrorCode_UNKNOWN_ERROR
	} else if !p.authorized {
		errorCode = models.ErrorCode_UNAUTHORIZED_USER
	}
	response := &models.LeaveRoomResponse{
		ErrorCode: int32(errorCode),
	}
	responseWrapper := &models.RoomServiceToClientMessage_LeaveRoomResponse{LeaveRoomResponse: response}
	return &models.RoomServiceToClientMessage{Response: responseWrapper}
}
