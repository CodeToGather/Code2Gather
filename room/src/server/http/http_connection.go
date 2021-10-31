package http

import (
	"log"
	"net/http"

	"code2gather.com/room/src/server"
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
	r.GET("/ws", func(c *gin.Context) {
		socket.WSHandler(c.Writer, c.Request)
	})

	err := r.Run(server.ConnHost + ":" + server.ConnPort)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
		return
	}
}
