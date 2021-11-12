package socket

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 60 * time.Second
)

type Client struct {
	manager *Manager
	// User id
	uid string
	// Room id
	rid string
	// If user left room
	hasLeft bool
	// Websocket connection.
	conn *websocket.Conn
	// Buffered channel of outgoing messages.
	send chan []byte
}

func (c *Client) unregisterFromRoom() {
	c.manager.unregister <- c
	c.manager.roomUnregister <- ClientRoomRegistration{
		roomId: c.rid,
		client: c,
	}
}

func (c *Client) joinRoom(rid string) {
	log.Printf("Client (%s) joining room", c.uid)
	c.rid = rid
	c.manager.roomRegister <- ClientRoomRegistration{
		roomId: rid,
		client: c,
	}
	c.manager.broadcast <- *NewJoinedRoomBroadcastMessage(rid, c.uid)
}

func (c *Client) leaveRoom() {
	if len(c.rid) == 0 {
		log.Printf("Client (%s) has yet to join any room", c.uid)
		return
	}
	log.Printf("Client (%s) leaving room", c.uid)
	c.manager.broadcast <- *NewLeftRoomBroadcastMessage(c.rid, c.uid)
	c.hasLeft = true
}

func (c *Client) read() {
	defer func() {
		log.Printf("Socket read (%s) closed", c.uid)
		c.unregisterFromRoom()
		if !c.hasLeft {
			c.manager.broadcast <- *NewDisconnectRoomBroadcastMessage(c.rid, c.uid)
		}
		if err := c.conn.Close(); err != nil {
			return
		}
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			//if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
			//	log.Println(err)
			//}
			log.Println(err)
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
				log.Println("Server sends close message")
				err := c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				if err != nil {
					return
				}
				return
			}
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
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
			//case <-ticker.C:
			//	if err := c.write(websocket.PingMessage, []byte{}); err != nil {
			//		return
			//	}
		}
	}

}
