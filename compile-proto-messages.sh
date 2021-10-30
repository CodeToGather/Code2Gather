#echo "Compiling message.proto in Python ..."

# TODO: Add other services accordingly
# for python projects:
# protoc -I=./proto-messages --python_out=path/to/output/dir ./proto-messages/*.proto
# e.g.
#protoc -I=./proto-messages --python_out=./pairing/src ./proto-messages/*.proto
#echo "Compiling message.proto in Python Successfully."


echo "Compiling message.proto in JavaScript ..."

# TODO: Add other services accordingly
# for js projects:
# protoc -I=./proto-messages --js_out=import_style=commonjs,binary:path/to/output/dir ./proto-messages/*.proto
# e.g.
protoc -I=./proto-messages --js_out=import_style=commonjs,binary:auth ./proto-messages/*.proto
echo "Compiling message.proto in JavaScript Successfully."


echo "Compiling message.proto in Go ..."
export PATH=$PATH:$HOME/go/bin
export PATH=$PATH:/usr/local/go/bin
protoc -I=./proto-messages --go_out=./room/src ./proto-messages/*.proto
echo "Compiling message.proto in Go Successfully."

