package socket

// Manager maintains the set of active clients,
// client room id and user id to client socket mapping, and
// broadcast messages to clients in an active room
type Manager struct {
	// Room ID to clients mapping
	rooms map[string]map[*Client]bool

	// Registered active clients
	clients map[*Client]bool

	// Message to broadcast to room
	broadcast chan RoomBroadcastMessage

	// Register/Connection requests from clients
	register     chan *Client
	roomRegister chan ClientRoomRegisteration

	// Unregister/Disconnection requests from clients
	unregister     chan *Client
	roomUnregister chan ClientRoomRegisteration
}

func NewManager() *Manager {
	return &Manager{
		rooms:          make(map[string]map[*Client]bool),
		clients:        make(map[*Client]bool),
		broadcast:      make(chan RoomBroadcastMessage),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		roomRegister:   make(chan ClientRoomRegisteration),
		roomUnregister: make(chan ClientRoomRegisteration),
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
		case action := <-m.roomRegister:
			if _, exists := m.rooms[action.roomId]; !exists {
				m.rooms[action.roomId] = make(map[*Client]bool)
			}
			m.rooms[action.roomId][action.client] = true
		case action := <-m.roomUnregister:
			if _, exists := m.rooms[action.roomId]; exists {
				if _, exists = m.rooms[action.roomId][action.client]; exists {
					delete(m.rooms[action.roomId], action.client)
				}
				if len(m.rooms[action.roomId]) == 0 {
					delete(m.rooms, action.roomId)
				}
			}
		case message := <-m.broadcast:
			for client := range m.rooms[message.roomId] {
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

type ClientRoomRegisteration struct {
	roomId string
	client *Client
}
