import React, { useEffect, useRef, useState } from 'react';

const apiToken = import.meta.env.VITE_FINN_HUBB_API_KEY;

const StockPrices = () => {
	const [messages, setMessages] = useState([]);
	const socketRef = useRef(null);

	useEffect(() => {
		console.log('API Token:', apiToken);

		// Initialize WebSocket connection
		const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiToken}`);
		socketRef.current = socket;

		// Handle successful connection
		socket.onopen = () => {
			console.log('WebSocket Connected!');
		};

		// Handle incoming messages
		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === 'trade') {
				setMessages((prev) => [...prev, JSON.stringify(data.data)]);
			}
		};

		// Handle errors
		socket.onerror = (error) => {
			console.error('WebSocket Error:', error);
		};

		// Handle WebSocket closure
		socket.onclose = (event) => {
			console.log('WebSocket Closed:', event);
		};

		// Cleanup function to close the WebSocket on unmount
		return () => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				socketRef.current.close();
			}
		};
	}, []);

	// Function to send a message safely
	const sendMessage = (message) => {
		if (socketRef.current?.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify(message));
		} else {
			console.warn('WebSocket not open. Cannot send message.');
		}
	};

	// Function to unsubscribe from a symbol
	const unsubscribe = (symbol) => {
		console.log('unsubscribing');
		sendMessage({ type: 'unsubscribe', symbol });
	};

	// Function to subscribe to a symbol
	const subscribe = (symbol) => {
		console.log('subscribing');
		sendMessage({ type: 'subscribe', symbol });
	};

	return (
		<div>
			<h2>WebSocket Messages</h2>
			<ul>
				{messages.map((msg, index) => (
					<li key={index}>{msg}</li>
				))}
			</ul>
			<button onClick={() => unsubscribe('AAPL')}>Unsubscribe AAPL</button>
			<button onClick={() => subscribe('AAPL')}>Subscribe AAPL</button>
		</div>
	);
};

export default StockPrices;
