const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

wss.on('connection', (ws) => {
    console.log('[INFO] New client connected.');
    clients.push(ws);

    ws.on('message', (data) => {
        try {
            const parsedData = JSON.parse(data);

            if (parsedData.type === 'message') {
                console.log(`[INFO] Broadcasting message: "${parsedData.message}" from ${parsedData.sender}`);
                // Broadcast the message to all connected clients
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'message',
                            message: parsedData.message,
                            sender: parsedData.sender,
                        }));
                    }
                });
            } else if (parsedData.type === 'typing') {
                console.log('[INFO] Broadcasting typing event...');
                // Broadcast typing event
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'typing',
                        }));
                    }
                });
            }
        } catch (error) {
            console.error('[ERROR] Failed to process message:', error);
        }
    });

    ws.on('close', () => {
        console.log('[INFO] Client disconnected.');
        // Remove the client from the list
        clients = clients.filter(client => client !== ws);
    });

    ws.onerror = (error) => {
        console.error('[ERROR] WebSocket error:', error);
    };
});

console.log('[INFO] WebSocket server started on ws://localhost:8080');