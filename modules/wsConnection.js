
class wsConnection {
  connection = null;
  server = null;
  userId = null;
  constructor(connection, server, userId, username) {
    this.connection = connection;
    this.server = server;
    this.userId = userId;
    this.username = username;
    connection.on("error", () => console.log("connection error"));

    connection.on("message", (data) => {
      const dataMsg = JSON.parse(data);
      if (dataMsg.username == null || dataMsg.username == "") {
        dataMsg.username = "I am a Guest !";
      }
      if (dataMsg.type == "message" && dataMsg.data != null) {
        server.broadcastMessage(this, dataMsg.data, dataMsg.username); // send to all other connections
      }
    });

    connection.on("close", () => {
      console.log("a client disconnected!");
      this.server.clientDisconnected(this);
    });
  }

  sendMessage(msg, username) {
    const dataMsg = { type: "message", data: msg, username: username };
    this.connection.send(JSON.stringify(dataMsg)); // send message to this specific client (on this connection)
  }
}

module.exports = wsConnection;

// type
// data
// { type: "message", data: "text"}
