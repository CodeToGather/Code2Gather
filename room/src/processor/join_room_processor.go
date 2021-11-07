package processor

import (
	"log"

	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/http_client"
	"github.com/golang/protobuf/proto"
)

type JoinRoomProcessor struct {
	request        *models.JoinRoomRequest
	uid            string
	rid            string
	interviewerId  string
	question       *models.QuestionMessage
	pairedUser     *models.User
	turnsCompleted int32
	authorized     bool
	err            error
}

func NewJoinRoomProcessor(request *models.JoinRoomRequest, uid string) *JoinRoomProcessor {
	return &JoinRoomProcessor{request: request, uid: uid, rid: request.GetRoomId()}
}

func (p *JoinRoomProcessor) IsRequestAuthorized() bool {
	return p.authorized
}

func (p *JoinRoomProcessor) GetRoomId() string {
	return p.rid
}

func (p *JoinRoomProcessor) GetRequest() proto.Message {
	return p.request
}

func (p *JoinRoomProcessor) GetPairedUserInfo() error {
	user, err := http_client.GetUserInfo(p.pairedUser.Id)
	if err != nil {
		return err
	}
	p.pairedUser = user
	return nil
}

func (p *JoinRoomProcessor) Process() error {
	log.Println("Processing create room request")
	room, err := room_agents.GetRoomById(p.rid)
	if err != nil {
		p.err = err
		return err
	}

	// Disallow user to rejoin already closed room
	if room.Status != models.Closed && room.HasUser(p.uid) {
		p.authorized = true
	} else {
		return nil
	}

	// Get information on paired user
	if p.uid == room.Uid1 {
		p.pairedUser = &models.User{
			Id: room.Uid2,
		}
	} else if p.uid == room.Uid2 {
		p.pairedUser = &models.User{
			Id: room.Uid1,
		}
	} else {
		return nil
	}

	if err = p.GetPairedUserInfo(); err != nil {
		p.err = err
		return err
	}

	if room.Status == models.FirstQuestion {
		p.interviewerId = room.Uid1
		question, err := question_agents.GetQuestionById(room.Qid1)
		if err != nil {
			p.err = err
			return err
		}
		p.question = question.ToQuestionMessage()
	} else {
		p.interviewerId = room.Uid2
		question, err := question_agents.GetQuestionById(room.Qid2)
		if err != nil {
			p.err = err
			return err
		}
		p.question = question.ToQuestionMessage()
	}
	p.turnsCompleted = room.GetTurnsCompleted()
	return nil
}

func (p *JoinRoomProcessor) GetResponse() proto.Message {
	errorCode := models.ErrorCode_NO_ERROR
	if p.err != nil {
		log.Println(p.err)
		errorCode = models.ErrorCode_UNKNOWN_ERROR
	} else if !p.authorized {
		errorCode = models.ErrorCode_UNAUTHORIZED_USER
	}
	response := &models.JoinRoomResponse{
		ErrorCode:      int32(errorCode),
		IsInterviewer:  p.interviewerId == p.uid,
		InterviewerId:  p.interviewerId,
		Question:       p.question,
		PairedUser:     p.pairedUser,
		TurnsCompleted: p.turnsCompleted,
	}
	responseWrapper := &models.RoomServiceToClientMessage_JoinRoomResponse{JoinRoomResponse: response}
	return &models.RoomServiceToClientMessage{Response: responseWrapper}
}
