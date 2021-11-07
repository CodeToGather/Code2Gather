package http_client

import "os"

var (
	AuthBaseUrl    = os.Getenv("AUTH_URL")
	HistoryBaseUrl = os.Getenv("HISTORY_URL")
)
