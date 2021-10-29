package http

import (
	"code2gather.com/room/src/server"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func StartHttpServer() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	v := r.Group("/room")
	{
		v.POST("/create", RoomCreationHandler)
	}

	err := r.Run(server.ConnHost + ":" + server.ConnPort)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
		return
	}
}
