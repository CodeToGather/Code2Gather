package http_client

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
)

type HttpClient struct {
	client *http.Client
}

func NewHttpClient() *HttpClient {
	return &HttpClient{client: http.DefaultClient}
}

func (c *HttpClient) Post(path string, data []byte) ([]byte, error) {
	dataBuffer := bytes.NewBuffer(data)
	resp, err := c.client.Post(path, "application/json", dataBuffer)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error %s", err)
		return nil, err
	}
	return respBody, err
}
