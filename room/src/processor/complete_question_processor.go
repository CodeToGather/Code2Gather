package processor

import (
	"log"

	"code2gather.com/room/src/agents/question_agents"
	"code2gather.com/room/src/agents/room_agents"
	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/http_client"
	"github.com/golang/protobuf/proto"
)

type CompleteQuestionProcessor struct {
	request             *models.CompleteQuestionRequest
	uid                 string
	rid                 string
	currentIntervieeId  string
	currentQuestion     *models.Question
	nextInterviewerId   string
	nextQuestionId      string
	isInterviewComplete bool
	turnsCompleted      int32
	authorized          bool
	err                 error
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

func (p *CompleteQuestionProcessor) SendMeetingRecord() error {
	meetingRecord := &models.CreateMeetingRequest{
		InterviewerId:         p.uid,
		IntervieweeId:         p.currentIntervieeId,
		Duration:              0,
		QuestionId:            p.currentQuestion.Id,
		QuestionTitle:         p.currentQuestion.Title,
		Difficulty:            p.currentQuestion.Difficulty,
		Language:              p.request.Language,
		CodeWritten:           p.request.CodeWritten,
		IsSolved:              p.request.IsSolved,
		FeedbackToInterviewee: p.request.FeedbackToInterviewee,
	}
	err := http_client.SendMeetingRecord(meetingRecord)
	return err
}

func (p *CompleteQuestionProcessor) Process() error {
	log.Println("Processing Complete Question Request")
	room, err := room_agents.GetRoomById(p.rid)
	if err != nil {
		p.err = err
		return err
	}
	if p.uid == room.Uid1 {
		p.authorized = true
		p.currentIntervieeId = room.Uid2
	} else if p.uid == room.Uid2 {
		p.authorized = true
		p.currentIntervieeId = room.Uid1
	} else {
		return nil
	}

	firstQuestion, err := question_agents.GetQuestionById(room.Qid1)
	if err != nil {
		p.err = err
		return err
	}
	secondQuestion, err := question_agents.GetQuestionById(room.Qid2)
	if err != nil {
		p.err = err
		return err
	}

	// If the room is at the first question, return the second question and mark room as SecondQuestion
	// Else, return empty nextInterviewerId and nextQuestion
	if room.Status == models.FirstQuestion {
		p.currentQuestion = firstQuestion
		p.nextInterviewerId = room.Uid2
		p.nextQuestionId = room.Qid2
		// Update room status to SecondQuestion
		room.Status = models.SecondQuestion
		p.isInterviewComplete = false
	} else {
		p.currentQuestion = secondQuestion
		// Update room status to Completed
		room.Status = models.Completed
		p.isInterviewComplete = true
	}
	p.turnsCompleted = room.GetTurnsCompleted()

	if err = room_agents.UpdateRoom(room); err != nil {
		p.err = err
		return err
	}

	if err = p.SendMeetingRecord(); err != nil {
		p.err = err
		return err
	}

	return nil
}

func (p *CompleteQuestionProcessor) GetResponse() proto.Message {
	errorCode := models.ErrorCode_NO_ERROR
	if p.err != nil {
		log.Println(p.err)
		errorCode = models.ErrorCode_UNKNOWN_ERROR
	} else if !p.authorized {
		errorCode = models.ErrorCode_UNAUTHORIZED_USER
	}
	response := &models.CompleteQuestionResponse{
		ErrorCode:            int32(errorCode),
		IsInterviewer:        p.nextInterviewerId == p.uid,
		InterviewerId:        p.nextInterviewerId,
		NextQuestionId:       p.nextQuestionId,
		IsInterviewCompleted: p.isInterviewComplete,
		TurnsCompleted:       p.turnsCompleted,
	}
	responseWrapper := &models.RoomServiceToClientMessage_CompleteQuestionResponse{CompleteQuestionResponse: response}
	return &models.RoomServiceToClientMessage{Response: responseWrapper}
}
