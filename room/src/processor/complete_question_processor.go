package processor

import (
	"log"

	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"github.com/golang/protobuf/proto"
)

type CompleteQuestionProcessor struct {
	request           *models.CompleteQuestionRequest
	uid               string
	rid               string
	nextInterviewerId string
	nextQuestion      *models.QuestionMessage
	authorized        bool
}

func NewCompleteQuestionProcessor(request *models.CompleteQuestionRequest, uid string) *CompleteQuestionProcessor {
	return &CompleteQuestionProcessor{request: request, uid: uid, rid: request.GetRoomId()}
}

func (p *CompleteQuestionProcessor) IsRequestAuthorized() bool {
	return p.authorized
}

func (p *CompleteQuestionProcessor) GetRoomId() string {
	return p.rid
}

func (p *CompleteQuestionProcessor) GetRequest() proto.Message {
	return p.request
}

func (p *CompleteQuestionProcessor) ProcessRoom() error {
	room, err := room_agents.GetRoomById(p.rid)
	if err != nil {
		return err
	}
	if p.uid == room.Uid1 || p.uid == room.Uid2 {
		p.authorized = true
	} else {
		return nil
	}

	// If the room is at the first question, return the second question and mark room as SecondQuestion
	// Else, return empty nextInterviewerId and nextQuestion
	if room.Status == models.FirstQuestion {
		p.nextInterviewerId = room.Uid2
		question, err := question_agents.GetQuestionById(room.Qid2)
		if err != nil {
			return err
		}
		p.nextQuestion = question.ToQuestionMessage()
		// Update room status to SecondQuestion
		room.Status = models.SecondQuestion
	} else {
		// Update room status to Completed
		room.Status = models.Completed
	}

	if err = room_agents.UpdateRoom(room); err != nil {
		return err
	}
	return nil
}

func (p *CompleteQuestionProcessor) SendMeetingRecord() error {
	return nil
}

func (p *CompleteQuestionProcessor) Process() error {
	log.Println("Processing Complete Question Request")
	if err := p.ProcessRoom(); err != nil {
		return err
	}
	if err := p.SendMeetingRecord(); err != nil {
		return err
	}
	return nil
}

func (p *CompleteQuestionProcessor) GetResponse() proto.Message {
	errorCode := models.ErrorCode_NO_ERROR
	if !p.authorized {
		errorCode = models.ErrorCode_UNAUTHORIZED_USER
	}
	response := &models.CompleteQuestionResponse{
		ErrorCode:     int32(errorCode),
		InterviewerId: p.nextInterviewerId,
		NextQuestion:  p.nextQuestion,
	}
	return response
}
