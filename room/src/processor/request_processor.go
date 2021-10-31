package processor

import "github.com/golang/protobuf/proto"

type RequestProcessor interface {
	GetRequest() proto.Message
	Process() error
	GetResponse() proto.Message
}
