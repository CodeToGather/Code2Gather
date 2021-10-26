package server

import (
	"code2gather.com/room/src/ui/processor"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func RoomCreationHandler(c *gin.Context) {
	var json map[string]interface{}

	_ = c.BindJSON(&json)

	users, exists := json["users"].([]string)
	fmt.Println(json)
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "missing users",
		})
		return
	}

	difficulty, exists := json["difficulty"].(string)

	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "missing difficulty",
		})
		return
	}

	handler := processor.NewRoomCreationProcessor(users, difficulty)
	_ = handler.Process()
	if handler == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "something went wrong",
		})
		return
	}
	fmt.Println(handler.Room)

	c.JSON(http.StatusOK, gin.H{
		"message": "hi",
	})
}
