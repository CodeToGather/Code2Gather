package http

import (
	"log"
	"net/http"

	"code2gather.com/room/src/server/socket"
	"github.com/gin-gonic/gin"
)

func StartHttpServer() {

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.POST("/create", RoomCreationHandler)
	r.GET("/", CheckInRoomHandler)
	r.GET("/question/:Qid", GetQuestionHandler)

	r.GET("/roomws/:Token", func(c *gin.Context) {
		authToken := c.Params.ByName("Token")
		socket.WSHandler(c.Writer, c.Request, authToken)
	})

	err := r.Run(":" + ConnPort)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
		return
	}
}
