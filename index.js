const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    // Add new client to the set
    clients.add(ws);
    console.log('New client connected');

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'message',
        user: 'System',
        text: 'Welcome to the chat!'
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received:', data);

        // Broadcast message to all connected clients
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on port 8080'); 