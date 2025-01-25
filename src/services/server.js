const WebSocket = require("ws");

// Create a WebSocket server on port 3000
const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("A user connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("A user disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:3000");
