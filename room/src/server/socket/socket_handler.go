package socket

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/processor"
	"code2gather.com/room/src/server/util"
	"github.com/golang/protobuf/proto"
)

func incomingRequestHandler(c *Client, request []byte) {
	var response proto.Message

	requestMessage := &models.ClientRequest{}
	if err := util.UnmarshalBytes(request, requestMessage); err != nil {
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
	case *models.ClientRequest_CompleteQuestionRequest:
		completeQuestionRequestHandler(c, r.CompleteQuestionRequest)
	case *models.ClientRequest_SubmitRatingRequest:
		submitRatingRequestHandler(c, r.SubmitRatingRequest)
	case *models.ClientRequest_LeaveRoomRequest:
		leaveRoomRequestHandler(c, r.LeaveRoomRequest)
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
	} else {
		// Check if the client has been registered to the room
		checkClientRegisteredToRoom(handler.IsRequestAuthorized(), handler.GetRoomId(), c)
	}

	// Send response to requesting user only
	sendResponseToRequestedClient(handler.GetResponse(), c)
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

func submitRatingRequestHandler(c *Client, request *models.SubmitRatingRequest) {
	log.Println("Handling Submit Rating Request")

	handler := processor.NewSubmitRatingProcessor(request, c.uid)
	err := handler.Process()
	if err != nil {
		log.Println(err)
	}

	// Check if the client has been registered to the room
	checkClientRegisteredToRoom(handler.IsRequestAuthorized(), handler.GetRoomId(), c)
	// Send response to requesting user only
	sendResponseToRequestedClient(handler.GetResponse(), c)
}

func leaveRoomRequestHandler(c *Client, request *models.LeaveRoomRequest) {
	log.Println("Handling Leave Room Request")

	handler := processor.NewLeaveRoomProcessor(request, c.uid)
	err := handler.Process()
	if err != nil {
		log.Println(err)
	}

	// Send response to requesting user only
	sendResponseToRequestedClient(handler.GetResponse(), c)

	if err != nil && handler.IsRequestAuthorized() {
		c.unregisterFromRoom()
		c.leaveRoom()
	}
}

func sendResponseToRequestedClient(response proto.Message, c *Client) {
	log.Println(response)
	respBytes, _ := util.MarshalToBytes(response)
	c.send <- respBytes
}

func broadcastResponseToRoom(response proto.Message, rid string, c *Client) {
	log.Println(response)
	respBytes, _ := util.MarshalToBytes(response)
	c.manager.broadcast <- RoomBroadcastMessage{
		roomId:  rid,
		message: respBytes,
	}
}

func checkClientRegisteredToRoom(authorized bool, rid string, c *Client) {
	if c.rid == rid {
		return
	}
	if authorized {
		c.joinRoom(rid)
	}
}
