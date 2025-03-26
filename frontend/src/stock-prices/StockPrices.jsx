import React, { useEffect, useRef, useState } from 'react';

const apiURL = import.meta.env.VITE_FINN_HUBB_API_URL;

const StockPrices = () => {
	const connection = useRef(null);
	// const [messages, setMessages] = useState([]);
	const [mostRecentPrice, setMostRecentPrice] = useState(null);
	const [stockName, setStockName] = useState('');

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

			if (data.type === 'trade') {
				const tradeData = data.data;

				const mostRecentTrade =
					tradeData.length > 0
						? tradeData.reduce((latest, trade) =>
								trade.t > latest.t ? trade : latest
						  )
						: null;

				setMostRecentPrice(Number(mostRecentTrade.p));
			}

			// console.log('Message from server', tradeData);

			// if (data.type !== 'ping') {
			// 	setMessages((prev) => [...prev, tradeData]);
			// }

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
		setStockName(symbol);
		connection.current.send(
			JSON.stringify({ type: 'subscribe', symbol: symbol })
		);
	};

	const unsubscribeToStock = (symbol) => {
		setMostRecentPrice(null);
		setStockName('');
		connection.current.send(
			JSON.stringify({ type: 'unsubscribe', symbol: symbol })
		);
	};

	return (
		<div>
			<div>
				Latest Trade
				<div key={stockName}>
					<h4>Stock: {stockName}</h4>
					<p>Price: {mostRecentPrice}</p>
				</div>
			</div>
			<button onClick={() => subscribeToStock('BINANCE:BTCUSDT')}>
				Subscribe
			</button>
			<button onClick={() => unsubscribeToStock('BINANCE:BTCUSDT')}>
				Unsubscribe
			</button>
			<button onClick={() => console.log(messages)}>Log</button>
		</div>
	);
};

export default StockPrices;
