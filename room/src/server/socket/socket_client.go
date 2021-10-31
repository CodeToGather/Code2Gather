package socket

import (
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	manager *Manager
	// User id
	uid string
	// Room id
	rid string
	// Websocket connection.
	conn *websocket.Conn
	// Buffered channel of outgoing messages.
	send chan []byte
}

func (c *Client) read() {
	defer func() {
		log.Printf("Socket read (%s) closed", c.uid)
		c.manager.unregister <- c
		c.manager.roomUnregister <- ClientRoomRegistration{
			roomId: c.rid,
			client: c,
		}
		c.manager.broadcast <- *NewDisconnectRoomBroadcastMessage(c.rid, c.uid)
		if err := c.conn.Close(); err != nil {
			return
		}
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Println(err)
			}
			break
		}
		incomingRequestHandler(c, message)
	}

}

func (c *Client) write() {
	defer func() {
		log.Printf("Socket write (%s) closed", c.uid)
		if err := c.conn.Close(); err != nil {
			return
		}
	}()

	for {
		select {
		case message, ok := <-c.send:
			if !ok {
				err := c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				if err != nil {
					return
				}
				return
			}
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				log.Println(err)
				return
			}
			if _, err = w.Write(message); err != nil {
				log.Println(err)
				return
			}
			n := len(c.send)
			for i := 0; i < n; i++ {
				if _, err = w.Write(<-c.send); err != nil {
					log.Println(err)
					return
				}
			}
			if err = w.Close(); err != nil {
				log.Println(err)
				return
			}
		}
	}

}
