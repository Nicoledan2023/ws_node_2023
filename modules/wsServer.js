const { WebSocketServer } = require('ws');

const wsConnection = require('./wsConnection');


class wsServer {
  lastUserId = 1; // last user (id)
  wsConnections = { connections: [] };
  constructor(httpServer) {
    this.wss = new WebSocketServer({ server: httpServer }); // websocket server does most of the heavy lifting

    this.wss.on("connection", (ws) => {
      // new websocket connection
      let conn = new wsConnection(ws, this, this.lastUserId++); // object to handle connection
      this.wsConnections.connections.push(conn);
      conn.sendMessage("hello from server");
    });
  }

  clientDisconnected = function (sender) {
    const posConn = this.wsConnections.connections.indexOf(sender);
    this.wsConnections.connections.splice(posConn, 1);
    this.broadcastMessage(sender, "disconnected");
  };

  broadcastMessage = function (sender, msg, username) {
    for (const wsc of this.wsConnections.connections) {
      if (wsc.userId != sender.userId) {
        wsc.sendMessage(`[${sender.userId}] ${username}  ${msg}`);
      }
    }
  };
}

module.exports = wsServer;