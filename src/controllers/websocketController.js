import { WebSocketServer } from "ws";
import url from "url";

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = url.parse(req.url);

    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on("connection", (ws) => {
    console.log("Client connected to /ws");

    ws.send("Welcome to the WebSocket!");
    
    //this function will return a random word on every 3 sec through websocket
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(`Random: ${Math.random().toString(36).slice(2)}`);
      }
    }, 3000);

    ws.on("close", () => {
      console.log("WebSocket closed");
      clearInterval(interval);
    });
  });

  console.log("✅ WebSocket server setup at /ws");
};

export default setupWebSocket;
