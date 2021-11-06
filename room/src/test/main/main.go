package main

import (
	"code2gather.com/room/src/server/util"
	"log"

	"code2gather.com/room/src/models"
	"encoding/base64"
)

// Marshal protobuf message for testing
func main() {
	//request := models.JoinRoomRequest{
	//	RoomId: "7c2836b3-dd6c-41b5-9f43-34cf03e73d57",
	//}
	//
	//r := &models.ClientRequest_JoinRoomRequest{JoinRoomRequest: &request}

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
	//IiYKJDdjMjgzNmIzLWRkNmMtNDFiNS05ZjQzLTM0Y2YwM2U3M2Q1Nw==
	request := models.LeaveRoomRequest{
		RoomId: "7c2836b3-dd6c-41b5-9f43-34cf03e73d57",
	}

	r := &models.ClientRequest_LeaveRoomRequest{LeaveRoomRequest: &request}

	clientRequest := models.ClientRequest{Request: r}

	bytes, _ := util.MarshalToBytes(&clientRequest)
	log.Println(base64.StdEncoding.EncodeToString(bytes))
}
