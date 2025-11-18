// server.js

// Import the WebSocket library
const WebSocket = require('ws');

// Set the port the server will listen on
const PORT = 8080;

// Create a new WebSocket Server instance
const wss = new WebSocket.Server({ port: PORT });

// Array to hold all connected clients (WebSockets)
const clients = new Set();

// Event: When a new client connects
wss.on('connection', function connection(ws) {
    console.log('A new client connected!');
    // Add the new client to our set of active clients
    clients.add(ws);

    // Event: When the server receives a message from this client
    ws.on('message', function incoming(message) {
        // We expect the message to be a Buffer object in Node.js,
        // so we convert it to a string for logging/broadcasting.
        const messageString = message.toString();
        console.log(`Received: ${messageString}`);

        // BROADCAST the message to ALL connected clients
        clients.forEach(client => {
            // Check if the client connection is open before sending
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });

    // Event: When this client disconnects
    ws.on('close', function close() {
        console.log('A client disconnected.');
        // Remove the disconnected client from the set
        clients.delete(ws);
    });

    // Event: Error handling
    ws.on('error', function error(err) {
        console.error('WebSocket Error:', err);
    });
});

console.log(`--- WebSocket Server is running on port ${PORT} ---`);
console.log('Open your chat.html file in multiple browser tabs to test!');