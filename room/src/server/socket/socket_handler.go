package socket

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/processor"
	"code2gather.com/room/src/server/middleware"
	"github.com/golang/protobuf/proto"
)

func incomingRequestHandler(c *Client, request []byte) {
	var response proto.Message

	requestMessage := &models.ClientRequest{}
	if err := middleware.UnmarshalBytes(request, requestMessage); err != nil {
		log.Println(err)
		response = &models.ErrorResponse{
			ErrorCode: int32(models.ErrorCode_MESSAGE_CODING_ERROR),
			Message:   "Unable to decode message",
		}
		sendResponseToRequestedClient(response, c)
		return
	}

	intermediateRequest := requestMessage.GetRequest()

	switch r := intermediateRequest.(type) {
	case *models.ClientRequest_JoinRoomRequest:
		joinRoomRequestHandler(c, r.JoinRoomRequest)
	case *models.ClientRequest_ExecuteCodeRequest:
		executeCodeRequestHandler(c, r.ExecuteCodeRequest)
	case *models.ClientRequest_CompleteQuestionRequest:
		completeQuestionRequestHandler(c, r.CompleteQuestionRequest)
	default:
		log.Println("Receive message of unknown type")
		response = &models.ErrorResponse{
			ErrorCode: int32(models.ErrorCode_MESSAGE_CODING_ERROR),
			Message:   "Unable to decode message",
		}
		sendResponseToRequestedClient(response, c)
	}
}

func joinRoomRequestHandler(c *Client, request *models.JoinRoomRequest) {
	log.Println("Handling Join Room Request")

	handler := processor.NewJoinRoomProcessor(request, c.uid)
	err := handler.Process()
	if err != nil {
		log.Println(err)
	}

	// Check if the client has been registered to the room
	checkClientRegisteredToRoom(handler.IsRequestAuthorized(), handler.GetRoomId(), c)
	// Send response to requesting user only
	sendResponseToRequestedClient(handler.GetResponse(), c)
}

func executeCodeRequestHandler(c *Client, request *models.ExecuteCodeRequest) {
	log.Println("Handling Execute Code Request")

	// TODO: send response to both users in the room
	response := &models.ExecuteCodeResponse{
		ErrorCode: 0,
	}
	log.Println(response)
	respBytes, _ := middleware.MarshalToBytes(response)
	c.send <- respBytes
}

func completeQuestionRequestHandler(c *Client, request *models.CompleteQuestionRequest) {
	log.Println("Handling Complete Question Request")
	handler := processor.NewCompleteQuestionProcessor(request, c.uid)
	err := handler.Process()
	if err != nil {
		log.Println(err)
	}

	// Check if the client has been registered to the room
	checkClientRegisteredToRoom(handler.IsRequestAuthorized(), handler.GetRoomId(), c)
	// Send response to both users in the room
	broadcastResponseToRoom(handler.GetResponse(), handler.GetRoomId(), c)
}

func sendResponseToRequestedClient(response proto.Message, c *Client) {
	log.Println(response)
	respBytes, _ := middleware.MarshalToBytes(response)
	c.send <- respBytes
}

func broadcastResponseToRoom(response proto.Message, rid string, c *Client) {
	log.Println(response)
	respBytes, _ := middleware.MarshalToBytes(response)
	c.manager.broadcast <- RoomBroadcastMessage{
		roomId:  rid,
		message: respBytes,
	}
}

func checkClientRegisteredToRoom(authorized bool, rid string, c *Client) {
	if authorized {
		c.manager.roomRegister <- ClientRoomRegisteration{
			roomId: rid,
			client: c,
		}
	}
}
