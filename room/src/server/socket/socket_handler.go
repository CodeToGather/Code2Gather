package socket

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/processor"
	"code2gather.com/room/src/server/middleware"
	"github.com/golang/protobuf/proto"
)

func incomingRequestHandler(c *Client, request []byte) {
	requestMessage := &models.ClientRequest{}
	if err := middleware.UnmarshalBytes(request, requestMessage); err != nil {
		// TODO: handle error
		log.Println(err)
	}
	intermediateRequest := requestMessage.GetRequest()

	var response proto.Message
	switch r := intermediateRequest.(type) {
	case *models.ClientRequest_JoinRoomRequest:
		response = joinRoomRequestHandler(c, r.JoinRoomRequest)
	case *models.ClientRequest_ExecuteCodeRequest:
		response = executeCodeRequestHandler(c, r.ExecuteCodeRequest)
	default:
		log.Println("Receive message of unknown type")
		response = &models.ErrorResponse{
			ErrorCode: int32(models.ErrorCode_MESSAGE_CODING_ERROR),
			Message:   "Unable to decode message",
		}
	}

	// Send back the response message
	log.Println(response)
	respBytes, _ := middleware.MarshalToBytes(response)
	c.send <- respBytes
}

func joinRoomRequestHandler(c *Client, request *models.JoinRoomRequest) proto.Message {
	log.Println("Handling Join Room Request")
	handler := processor.NewJoinRoomProcessor(request, c.uid)
	err := handler.Process()
	if err != nil {
		log.Println(err)
	}
	return handler.GetResponse()
}

func executeCodeRequestHandler(c *Client, request *models.ExecuteCodeRequest) proto.Message {
	log.Println("Handling Execute Code Request")
	response := &models.ExecuteCodeResponse{
		ErrorCode: 0,
	}
	return response
}
