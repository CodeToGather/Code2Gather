package http_client

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/middleware"
	"encoding/json"
)

var authBaseUrl = "http://localhost:8001"
var historyBaseUrl = "http://localhost:8002"

var httpClient *HttpClient

func init() {
	httpClient = NewHttpClient()
}

func GetUserId(token string) (uid string, err error) {
	resp, err := httpClient.GetWithAuthHeader(authBaseUrl+"/auth", token)
	var responseMessage *models.AuthResponse
	err = json.Unmarshal(resp, &responseMessage)
	if err != nil {
		return
	}
	uid = responseMessage.Uid
	return
}

func SendMeetingRecord(meetingRecord *models.CreateMeetingRequest) error {
	data, err := middleware.MarshalToJson(meetingRecord)
	if err != nil {
		log.Println(err)
		return err
	}
	// TODO: handle error response from history service
	_, err = httpClient.Post(historyBaseUrl+"/meeting", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func SendRating(rating *models.CreateRatingRequest) error {
	data, err := middleware.MarshalToJson(rating)
	if err != nil {
		log.Println(err)
		return err
	}
	// TODO: handle error response from history service
	_, err = httpClient.Post(historyBaseUrl+"/rating", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
