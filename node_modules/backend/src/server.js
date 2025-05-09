import { createServer } from 'http';
// import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import app from './app.js'; // Ensure this is the correct import

dotenv.config();

const { PORT = 5002 } = process.env;

// Create an HTTP server with Express
const server = createServer(app);

// Attach WebSocket server to the same HTTP server
// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
// 	console.log('Client connected');

// 	ws.on('message', (message) => {
// 		console.log(`Received: ${message}`);
// 		ws.send(`Server: ${message}`); // Echo message back to client
// 	});

// 	ws.on('close', () => console.log('Client disconnected'));

// 	ws.on('error', (error) => console.error('WebSocket error:', error));
// });

// Start the server
server.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
