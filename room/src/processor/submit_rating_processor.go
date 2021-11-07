package processor

import (
	"log"

	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/http_client"
	"github.com/golang/protobuf/proto"
)

type SubmitRatingProcessor struct {
	request    *models.SubmitRatingRequest
	uid        string
	rid        string
	ratedUid   string
	authorized bool
	err        error
}

func NewSubmitRatingProcessor(request *models.SubmitRatingRequest, uid string) *SubmitRatingProcessor {
	return &SubmitRatingProcessor{request: request, uid: uid, rid: request.GetRoomId()}
}

func (p *SubmitRatingProcessor) IsRequestAuthorized() bool {
	return p.authorized
}

func (p *SubmitRatingProcessor) GetRoomId() string {
	return p.rid
}

func (p *SubmitRatingProcessor) GetRequest() proto.Message {
	return p.request
}

func (p *SubmitRatingProcessor) SendMeetingRecord() error {
	rating := &models.CreateRatingRequest{
		Rating:       p.request.GetRating(),
		RatingUserId: p.uid,
		RatedUserId:  p.ratedUid,
		RoomId:       p.rid,
	}
	err := http_client.SendRating(rating)
	return err
}

func (p *SubmitRatingProcessor) Process() error {
	log.Println("Processing Submit Rating Request")
	room, err := room_agents.GetRoomById(p.rid)
	if err != nil {
		p.err = err
		return err
	}
	if p.uid == room.Uid1 {
		p.authorized = true
		p.ratedUid = room.Uid2
	} else if p.uid == room.Uid2 {
		p.authorized = true
		p.ratedUid = room.Uid1
	} else {
		return nil
	}

	if err = p.SendMeetingRecord(); err != nil {
		p.err = err
		return err
	}

	return nil
}

func (p *SubmitRatingProcessor) GetResponse() proto.Message {
	errorCode := models.ErrorCode_NO_ERROR
	if p.err != nil {
		log.Println(p.err)
		errorCode = models.ErrorCode_UNKNOWN_ERROR
	} else if !p.authorized {
		errorCode = models.ErrorCode_UNAUTHORIZED_USER
	}
	response := &models.SubmitRatingResponse{
		ErrorCode: int32(errorCode),
	}
	responseWrapper := &models.RoomServiceToClientMessage_SubmitRatingResponse{SubmitRatingResponse: response}
	return &models.RoomServiceToClientMessage{Response: responseWrapper}
}
