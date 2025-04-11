// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const rooms = {};

wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.slice(1));
  const roomId = params.get("room");
  if (!rooms[roomId]) rooms[roomId] = [];
  rooms[roomId].push(ws);

  ws.on("message", msg => {
    rooms[roomId].forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    rooms[roomId] = rooms[roomId].filter(c => c !== ws);
  });
});

app.use(express.static("."));
server.listen(3000, () => console.log("Chat server running at http://localhost:3000"));