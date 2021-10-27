const Automerge = require("automerge")

let result = Automerge.from({ code: "print(\"Hello World\")" });

function arrayToBase64String(data) {
  const buff = new Buffer.from(data)
  const base64data = buff.toString('base64')
  return base64data
}

function base64StringToArray(s) {
  const result = Buffer.from(s, 'base64')
  return result
}

const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
})

io.on("connection", socket => {
  socket.on('text-change', (encodedChanges) => {
    const changes = base64StringToArray(encodedChanges)
    result = Automerge.applyChanges(result, changes)
    socket.broadcast.emit('receive-changes', encodedChanges)
  })
  console.log("connected")
  socket.emit("set-document", arrayToBase64String(Automerge.save(result)))
});
