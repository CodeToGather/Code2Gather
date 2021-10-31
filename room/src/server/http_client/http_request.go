package http_client

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/middleware"
)

var historyBaseUrl = "http://localhost:8002"

func SendMeetingRecord(meetingRecord *models.CreateMeetingRequest) error {
	httpClient := NewHttpClient()
	data, err := middleware.MarshalToJson(meetingRecord)
	//log.Println(meetingRecord)
	//log.Println(string(data))
	if err != nil {
		log.Println(err)
		return err
	}
	_, err = httpClient.Post(historyBaseUrl+"/meeting", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func SendRating(rating *models.CreateRatingRequest) error {
	httpClient := NewHttpClient()
	data, err := middleware.MarshalToJson(rating)
	//log.Println(rating)
	//log.Println(string(data))
	if err != nil {
		log.Println(err)
		return err
	}
	_, err = httpClient.Post(historyBaseUrl+"/rating", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
