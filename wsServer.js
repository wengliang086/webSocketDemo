var ws = require("nodejs-websocket")

let port = 3000;
let clientCount = 0

// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    console.log("New connection")
    clientCount++
    conn.nickname = 'user' + clientCount

    let msg = {}
    msg.type = "enter"
    msg.data = conn.nickname + ' comes in'

    broadcast(server, JSON.stringify(msg))
    conn.on("text", function (str) {
        console.log("Received " + str)
        let msg = {}
        msg.type = "message"
        msg.data = conn.nickname + ' says: ' + str
        broadcast(server, JSON.stringify(msg))
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
        let msg = {}
        msg.type = "leave"
        msg.data = conn.nickname + " left"
        broadcast(server, JSON.stringify(msg))
    })
    conn.on("error", function (err) {
        console.log(err)
    })
}).listen(port)

console.log('WebSocket server listening on port ' + port);

function broadcast(server, msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}