package socket

import (
	"github.com/gorilla/websocket"
	"log"
)

type Client struct {
	manager *Manager
	// User id
	uid string
	// Websocket connection.
	conn *websocket.Conn
	// Buffered channel of outgoing messages.
	send chan []byte
}

func (c *Client) read() {
	defer func() {
		c.manager.unregister <- c
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
		//c.manager.broadcast <- RoomBroadcastMessage{message: message}
		//c.send <- message
		incomingRequestHandler(c, message)
	}

}

func (c *Client) write() {
	defer func() {
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
			c.conn.WriteMessage(websocket.TextMessage, message)
			//w, err := c.conn.NextWriter(websocket.TextMessage)
			//if err != nil {
			//	return
			//}
			//if _, err := w.Write(message); err != nil {
			//	return
			//}
			//n := len(c.send)
			//for i := 0; i < n; i++ {
			//	if _, err := w.Write(<-c.send); err != nil {
			//		return
			//	}
			//}
			//if err := w.Close; err != nil {
			//	return
			//}
		}
	}

}
