package socket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var WSManager = NewManager()

var WSUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func init() {
	go WSManager.Run()
}

func WSHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := WSUpgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Printf("Failed to set websocket upgrade: %+v\n\n", err)
		return
	}

	// Read user id from authorization header
	values, ok := r.Header["Authorization"]
	if !ok || len(values) == 0 {
		log.Printf("Missing authorization header")
		return
	}

	uid := values[0]
	log.Printf("Client (%s) connected", uid)
	client := &Client{
		manager: WSManager,
		uid:     uid,
		conn:    conn,
		send:    make(chan []byte, 256),
	}
	client.manager.register <- client

	go client.read()
	go client.write()
}
