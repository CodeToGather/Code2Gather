package http_client

import (
	"code2gather.com/room/src/server/util"
	"log"

	"code2gather.com/room/src/models"
)

var httpClient *HttpClient

func init() {
	httpClient = NewHttpClient()
}

func GetUserId(token string) (uid string, err error) {
	//resp, err := httpClient.GetWithAuthHeader(AuthBaseUrl+"/auth", token)
	//var responseMessage *models.AuthResponse
	//err = json.Unmarshal(resp, &responseMessage)
	//if err != nil {
	//	return
	//}
	//uid = responseMessage.Uid
	uid = token
	return
}

func GetUserInfo(uid string) (user *models.User, err error) {
	//request := models.GetUserRequest{Uid: uid}
	//data, err := util.MarshalToJson(&request)
	//if err != nil {
	//	log.Println(err)
	//	return
	//}
	//resp, err := httpClient.Get(HistoryBaseUrl+"/", data)
	//if err != nil {
	//	return
	//}
	//err = json.Unmarshal(resp, &user)
	//if err != nil {
	//	return
	//}
	user = &models.User{
		Id:             "test2",
		GithubUsername: "testtest",
		PhotoUrl:       "test",
		ProfileUrl:     "test",
	}
	return
}

func SendMeetingRecord(meetingRecord *models.CreateMeetingRequest) error {
	data, err := util.MarshalToJson(meetingRecord)
	if err != nil {
		log.Println(err)
		return err
	}
	// TODO: handle error response from history service
	_, err = httpClient.Post(HistoryBaseUrl+"/meeting", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func SendRating(rating *models.CreateRatingRequest) error {
	data, err := util.MarshalToJson(rating)
	if err != nil {
		log.Println(err)
		return err
	}
	// TODO: handle error response from history service
	_, err = httpClient.Post(HistoryBaseUrl+"/rating", data)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
