package processor

import (
	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/agents/room_agents"
	"log"

	"code2gather.com/room/src/models"
	"github.com/golang/protobuf/proto"
)

type JoinRoomProcessor struct {
	request       *models.JoinRoomRequest
	uid           string
	rid           string
	interviewerId string
	question      *models.QuestionMessage
	authorized    bool
}

func NewJoinRoomProcessor(request *models.JoinRoomRequest, uid string) *JoinRoomProcessor {
	return &JoinRoomProcessor{request: request, uid: uid, rid: request.GetRoomId()}
}

func (p *JoinRoomProcessor) GetRequest() proto.Message {
	return p.request
}

func (p *JoinRoomProcessor) Process() error {
	log.Println("Processing create room request")
	room, err := room_agents.GetRoomById(p.rid)
	if err != nil {
		return err
	}
	if p.uid == room.Uid1 || p.uid == room.Uid2 {
		p.authorized = true
	} else {
		return nil
	}

	if room.Status == models.FirstQuestion {
		p.interviewerId = room.Uid1
		question, err := question_agents.GetQuestionById(room.Qid1)
		if err != nil {
			return err
		}
		p.question = question.ToQuestionMessage()
	} else {
		p.interviewerId = room.Uid2
		question, err := question_agents.GetQuestionById(room.Qid2)
		if err != nil {
			return err
		}
		p.question = question.ToQuestionMessage()
	}

	return nil
}

func (p *JoinRoomProcessor) GetResponse() proto.Message {
	errorCode := models.ErrorCode_NO_ERROR
	if !p.authorized {
		errorCode = models.ErrorCode_UNAUTHORIZED_USER
	}
	response := &models.JoinRoomResponse{
		ErrorCode:     int32(errorCode),
		InterviewerId: p.interviewerId,
		Question:      p.question,
	}
	return response
}
