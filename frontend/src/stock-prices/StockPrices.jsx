import React, { useEffect, useRef, useState } from 'react';

const apiURL = import.meta.env.VITE_FINN_HUBB_API_URL;

const StockPrices = () => {
	const connection = useRef(null);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		console.log(apiURL);

		const socket = new WebSocket(
			'wss://ws.finnhub.io?token=cvefg0pr01ql1jnb32cgcvefg0pr01ql1jnb32d0'
		);

		socket.addEventListener('open', (event) => {
			console.log('WebSocket connected');
		});

		socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			console.log('Message from server', data);

			if (data.type !== 'ping') {
				setMessages((prev) => [...prev, data]);
			}

			// Handle errors gracefully
			if (data.type === 'error') {
				console.error('Error from server:', data.msg);
			}
		});

		socket.addEventListener('close', () => {
			console.log('WebSocket closed');
		});

		connection.current = socket;

		return () => {
			if (
				connection.current &&
				connection.current.readyState === WebSocket.OPEN
			) {
				console.log('Closing WebSocket...');
				connection.current.close();
			}
		};
	}, []);

	const subscribeToStock = (symbol) => {
		console.log(`subscibing to ${symbol}`);
		console.log(messages);
		connection.current.send(
			JSON.stringify({ type: 'subscribe', symbol: 'AAPL' })
		);
	};

	const unsubscribeToStock = (symbol) => {
		console.log(`unsubscibing to ${symbol}`);
		connection.current.send(
			JSON.stringify({ type: 'unsubscribe', symbol: 'AAPL' })
		);
	};

	return (
		<div>
			<div>
				This our our messages
				{messages.map((message) => {
					if (message.type === 'trade') {
						return <div>{message}</div>;
					}
				})}
			</div>
			<button onClick={() => subscribeToStock('BINANCE:BTCUSDT')}>
				Subscribe
			</button>
			<button onClick={() => unsubscribeToStock('BINANCE:BTCUSDT')}>
				Unsubscribe
			</button>
		</div>
	);
};

export default StockPrices;
