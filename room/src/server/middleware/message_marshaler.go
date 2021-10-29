package middleware

import (
	"net/http"

	"github.com/golang/protobuf/jsonpb"
	"github.com/golang/protobuf/proto"
)

func UnmarshalRequestBody(request *http.Request, message proto.Message) error {
	return jsonpb.Unmarshal(request.Body, message)
}

func MarshalResponse(message proto.Message) ([]byte, error) {
	m := jsonpb.Marshaler{}
	json, err := m.MarshalToString(message)
	if err != nil {
		return nil, err
	}
	return []byte(json), err
}
