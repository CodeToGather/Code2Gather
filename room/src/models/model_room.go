package models

type Room struct {
	Users     []string   `json:"users"`
	Questions []Question `json:"questions"`
}
