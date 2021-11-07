package middleware

import (
	"log"
	"net/http"

	"code2gather.com/room/src/models"
	"code2gather.com/room/src/server/http_client"
)

func GetUidFromAuthToken(r *http.Request) (uid string, err error) {
	// Read user id from authorization header
	values, ok := r.Header["Authorization"]
	if !ok || len(values) == 0 {
		log.Printf("Missing authorization header")
		err = models.NewBusinessError(models.ErrorCode_UNAUTHORIZED_USER)
		return
	}

	uid, err = http_client.GetUserId(values[0])

	if err != nil {
		log.Printf("Failed to get user id from authorization header")
		return
	}
	return
}
