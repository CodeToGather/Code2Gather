package http

import (
	"log"
	"net/http"

	"code2gather.com/room/src/processor"
	"code2gather.com/room/src/server/middleware"
	"code2gather.com/room/src/server/util"
	"github.com/gin-gonic/gin"
)

func handleInvalidRequestBody(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"message": "invalid request body",
	})
}

func handleUnauthorizaedRequest(c *gin.Context) {
	c.JSON(http.StatusUnauthorized, gin.H{})
}

func handleBadRequest(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"message": "something went wrong",
	})
}

func RoomCreationHandler(c *gin.Context) {
	handler := processor.NewRoomCreationProcessor()

	if err := util.UnmarshalRequestBody(c.Request, handler.GetRequest()); err != nil {
		log.Println(err)
		handleInvalidRequestBody(c)
		return
	}

	if err := handler.Process(); err != nil {
		log.Println(err)
		handleBadRequest(c)
		return
	}

	resp, err := util.MarshalToJson(handler.GetResponse())

	if err != nil {
		log.Println(err)
		handleBadRequest(c)
		return
	}

	c.Data(http.StatusOK, gin.MIMEJSON, resp)
}

func CheckInRoomHandler(c *gin.Context) {

	uid, err := middleware.GetUidFromAuthToken(c.Request)

	if err != nil {
		handleUnauthorizaedRequest(c)
		return
	}

	handler := processor.NewCheckInRoomProcessor(uid)

	if err = handler.Process(); err != nil {
		log.Println(err)
		handleBadRequest(c)
		return
	}

	resp, err := util.MarshalToJson(handler.GetResponse())

	if err != nil {
		log.Println(err)
		handleBadRequest(c)
		return
	}

	c.Data(http.StatusOK, gin.MIMEJSON, resp)
}
