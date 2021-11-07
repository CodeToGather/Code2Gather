package middleware

import (
	"log"

	"code2gather.com/room/src/server/http_client"
)

func GetUidFromAuthToken(token string) (uid string, err error) {
	uid, err = http_client.GetUserId(token)
	if err != nil {
		log.Printf("Failed to get user id from authorization token")
		return
	}
	return
}

//func GetUidFromAuthToken(r *http.Request) (uid string, err error) {
//	// Read user id from authorization header
//	values, ok := r.Header["Authorization"]
//	if !ok || len(values) == 0 {
//		log.Printf("Missing authorization header")
//		err = models.NewBusinessError(models.ErrorCode_UNAUTHORIZED_USER)
//		return
//	}
//
//	uid, err = http_client.GetUserId(values[0])
//
//	if err != nil {
//		log.Printf("Failed to get user id from authorization header")
//		return
//	}
//	return
//}
