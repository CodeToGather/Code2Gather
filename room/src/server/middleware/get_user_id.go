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
