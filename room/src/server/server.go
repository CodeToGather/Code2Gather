package server

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func StartServer() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	err := r.Run(ConnHost + ":" + ConnPort)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
		return
	}
}
