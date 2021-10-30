package http_client

import (
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/middleware"
)

func SendMeetingRecord(meetingRecord *models.CreateMeetingRequest) error {
	httpClient := NewHttpClient()
	data, err := middleware.MarshalToJson(meetingRecord)
	//log.Println(meetingRecord)
	//log.Println(string(data))
	if err != nil {
		log.Println(err)
		return err
	}
	_, err = httpClient.Post("http://localhost:8002/meeting", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
