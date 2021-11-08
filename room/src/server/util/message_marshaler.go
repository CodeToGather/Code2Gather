package util

import (
	"net/http"

	"github.com/golang/protobuf/jsonpb"
	"github.com/golang/protobuf/proto"
)

func UnmarshalRequestBody(request *http.Request, message proto.Message) error {
	return jsonpb.Unmarshal(request.Body, message)
}

func MarshalToJson(message proto.Message) ([]byte, error) {
	m := jsonpb.Marshaler{EmitDefaults: true}
	json, err := m.MarshalToString(message)
	if err != nil {
		return nil, err
	}
	return []byte(json), err
}

func UnmarshalJson(json string, message proto.Message) error {
	return jsonpb.UnmarshalString(json, message)
}

func UnmarshalBytes(request []byte, message proto.Message) error {
	return proto.Unmarshal(request, message)
}

func MarshalToBytes(message proto.Message) ([]byte, error) {
	return proto.Marshal(message)
}
