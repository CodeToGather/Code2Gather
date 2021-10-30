package socket

// Manager maintains the set of active clients,
// client room id and user id to client socket mapping, and
// broadcast messages to clients in an active room
type Manager struct {
	// Room ID to clients mapping
	rooms map[string][]*Client

	// Registered active clients
	clients map[*Client]bool

	// Message to broadcast to room
	broadcast chan RoomBroadcastMessage

	// Register/Connection requests from clients
	register chan *Client

	// Unregister/Disconnection requests from clients
	unregister chan *Client
}

func NewManager() *Manager {
	return &Manager{
		rooms:      make(map[string][]*Client),
		clients:    make(map[*Client]bool),
		broadcast:  make(chan RoomBroadcastMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (m *Manager) Run() {
	for {
		select {
		case client := <-m.register:
			m.clients[client] = true
		case client := <-m.unregister:
			if _, exists := m.clients[client]; exists {
				delete(m.clients, client)
				close(client.send)
			}
		case message := <-m.broadcast:
			for _, client := range m.rooms[message.roomId] {
				select {
				case client.send <- message.message:
				default:
					close(client.send)
					delete(m.clients, client)
				}
			}
		}
	}
}

type RoomBroadcastMessage struct {
	roomId  string
	message []byte
}
