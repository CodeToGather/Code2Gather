package http_client

import (
	"encoding/json"
	"log"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/util"
)

var httpClient *HttpClient

func init() {
	httpClient = NewHttpClient()
}

func GetUserId(token string) (uid string, err error) {
	resp, err := httpClient.GetWithAuthHeader(AuthBaseUrl+"/auth", token)
	var responseMessage *models.AuthResponse
	err = json.Unmarshal(resp, &responseMessage)
	if err != nil {
		return
	}
	uid = responseMessage.Uid
	return
}

func GetUserInfo(uid string) (user *models.User, err error) {
	resp, err := httpClient.Get(HistoryBaseUrl + "/user/" + uid)
	if err != nil {
		return
	}

	user = &models.User{
		Id: uid,
	}

	var m map[string]interface{}
	err = json.Unmarshal(resp, &m)
	if err != nil {
		return
	}

	if v, ok := m["githubUsername"]; ok {
		user.GithubUsername = v.(string)
	}
	if v, ok := m["profileUrl"]; ok {
		user.ProfileUrl = v.(string)
	}
	if v, ok := m["photoUrl"]; ok {
		user.PhotoUrl = v.(string)
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
