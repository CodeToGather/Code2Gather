package main

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/middleware"
	"encoding/base64"
)

// Marshal protobuf message for testing
func main() {
	request := models.JoinRoomRequest{
		RoomId: "58da6ae0-5c29-4f1e-a30e-242276f65dd3",
	}

	jrr := &models.ClientRequest_JoinRoomRequest{JoinRoomRequest: &request}

	clientRequest := models.ClientRequest{Request: jrr}

	bytes, _ := middleware.MarshalToBytes(&clientRequest)
	log.Println(base64.StdEncoding.EncodeToString(bytes))
}
