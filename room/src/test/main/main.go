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

	r := &models.ClientRequest_JoinRoomRequest{JoinRoomRequest: &request}

	//request := models.CompleteQuestionRequest{
	//	RoomId:                "58da6ae0-5c29-4f1e-a30e-242276f65dd3",
	//	IsSolved:              true,
	//	FeedbackToInterviewee: "v good interviewer",
	//	CodeWritten:           "print('hello world')",
	//	Language:              models.Language_PYTHON,
	//}
	//
	//r := &models.ClientRequest_CompleteQuestionRequest{CompleteQuestionRequest: &request}

	//request := models.SubmitRatingRequest{
	//	RoomId: "58da6ae0-5c29-4f1e-a30e-242276f65dd3",
	//	Rating: 5,
	//}
	//
	//r := &models.ClientRequest_SubmitRatingRequest{SubmitRatingRequest: &request}

	clientRequest := models.ClientRequest{Request: r}

	bytes, _ := middleware.MarshalToBytes(&clientRequest)
	log.Println(base64.StdEncoding.EncodeToString(bytes))
}
