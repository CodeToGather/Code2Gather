package processor

import (
	"code2gather.com/room/src/agents/question_agents"
	"log"

	"code2gather.com/room/src/models"
	"github.com/golang/protobuf/proto"
)

type GetQuestionProcessor struct {
	qid      string
	question *models.QuestionMessage
}

func NewGetQuestionProcessor(qid string) *GetQuestionProcessor {
	return &GetQuestionProcessor{qid: qid}
}

func (p *GetQuestionProcessor) GetRequest() proto.Message {
	return nil
}

func (p *GetQuestionProcessor) Process() (err error) {
	log.Println("Processing Get Question Request")
	question, err := question_agents.GetQuestionById(p.qid)
	if err == nil {
		p.question = question.ToQuestionMessage()
	}
	return err
}

func (p *GetQuestionProcessor) GetResponse() proto.Message {
	resp := models.GetQuestionResponse{Question: p.question}
	return &resp
}
