package socket

import (
	"log"
	"net/http"

	"code2gather.com/room/src/server/middleware"
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
		conn.Close()
		return
	}

	uid, err := middleware.GetUidFromAuthToken(r)

	if err != nil {
		conn.Close()
		return
	}

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
