package server

import (
	"code2gather.com/room/src/server/middleware"
	"log"
	"net/http"

	"code2gather.com/room/src/processor"
	"github.com/gin-gonic/gin"
)

func RoomCreationHandler(c *gin.Context) {
	handler := processor.NewRoomCreationProcessor()

	if err := middleware.UnmarshalRequestBody(c.Request, handler.GetRequest()); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request body",
		})
		return
	}

	if err := handler.Process(); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "something went wrong",
		})
		return
	}

	resp, err := middleware.MarshalResponse(handler.GetResponse())

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "something went wrong",
		})
	}

	c.Data(http.StatusOK, gin.MIMEJSON, resp)
}
