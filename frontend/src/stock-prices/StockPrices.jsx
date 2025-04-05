import React, { useEffect, useRef, useState } from 'react';
import tradeMessage from './stock-prices-functions/tradeMessage';
import Queue from '../classes/Queue';

const ALPACA_API_KEY_ID = import.meta.env.VITE_ALPACA_API_KEY_ID;
const ALPACA_API_SECRET_ID = import.meta.env.VITE_ALPACA_API_SECRET_ID;

const StockPrices = () => {
	const connection = useRef(null);

	const [stockName, setStockName] = useState('');
	const [tickerInput, setTickerInput] = useState('');
	const [currentTicker, setCurrentTicker] = useState('');
	const [trades, setTrades] = useState([]);

	const tradeQueue = new Queue(10);

	useEffect(() => {
		const socket = new WebSocket('wss://stream.data.alpaca.markets/v2/test');
		connection.current = socket;

		socket.addEventListener('open', () => {
			console.log('WebSocket connected');

			const authMsg = {
				action: 'auth',
				key: ALPACA_API_KEY_ID,
				secret: ALPACA_API_SECRET_ID,
			};

			socket.send(JSON.stringify(authMsg));
		});

		socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);
			console.log('Message from server:', data);

			// Handle authentication confirmation
			if (
				Array.isArray(data) &&
				data[0]?.T === 'success' &&
				data[0]?.msg === 'authenticated'
			) {
				console.log('Authenticated. Subscribing to streams...');
				if (currentTicker) {
					const subscribeMsg = {
						action: 'subscribe',
						trades: [currentTicker],
						quotes: [currentTicker],
						bars: [currentTicker],
					};
					socket.send(JSON.stringify(subscribeMsg));
				}
				return;
			}

			// Handle trade data
			if (Array.isArray(data)) {
				data.forEach((item) => {
					if (item.T === 't') {
						const tosObject = tradeMessage(item);
						tradeQueue.enqueue(tosObject);
						setTrades([...tradeQueue.getItems()]);
					}

					// Add handling for 'q' (quote) and 'b' (bar) if needed
				});
			}

			// Handle errors
			if (data.type === 'error') {
				console.error('Error from server:', data.msg);
			}
		});

		socket.addEventListener('close', () => {
			console.log('WebSocket closed');
		});

		return () => {
			if (
				connection.current &&
				connection.current.readyState === WebSocket.OPEN
			) {
				console.log('Closing WebSocket...');
				connection.current.close();
			}
		};
	}, [currentTicker]);

	const subscribeToStock = (symbol) => {
		console.log(`Subscribing to ${symbol}`);
		setStockName(symbol);

		const subscribeMsg = {
			action: 'subscribe',
			trades: [symbol],
			quotes: [symbol],
			bars: [symbol],
		};

		if (
			connection.current &&
			connection.current.readyState === WebSocket.OPEN
		) {
			connection.current.send(JSON.stringify(subscribeMsg));
		}
	};

	const unsubscribeToStock = (symbol) => {
		console.log(`Unsubscribing from ${symbol}`);
		const unsubscribeMsg = {
			action: 'unsubscribe',
			trades: [symbol],
			quotes: [symbol],
			bars: [symbol],
		};

		if (
			connection.current &&
			connection.current.readyState === WebSocket.OPEN
		) {
			connection.current.send(JSON.stringify(unsubscribeMsg));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const nextTicker = tickerInput.toUpperCase();

		if (currentTicker) {
			unsubscribeToStock(currentTicker);
		}

		setCurrentTicker(nextTicker);
		setTickerInput('');
		subscribeToStock(nextTicker);
	};

	const mappedTrades = trades.map((trade, index) => {
		return (
			<li key={index}>
				<p>
					Index: {index + 1} | Symbol: {trade.symbol} | Price: {trade.price} |
					Size: {trade.size} | Time: {new Date(trade.time).toLocaleTimeString()}
				</p>
			</li>
		);
	});

	return (
		<div>
			<h2>Latest Trade</h2>
			<div key={stockName}>
				<h4>Stock: {stockName}</h4>
				<ul>{mappedTrades}</ul>
			</div>

			<form onSubmit={handleSubmit}>
				<label htmlFor="stock_ticker">Stock Ticker:</label>
				<input
					id="stock_ticker"
					type="text"
					name="stock_ticker"
					value={tickerInput}
					onChange={({ target }) => setTickerInput(target.value)}
				/>
				<button type="submit">Subscribe</button>
			</form>
		</div>
	);
};

export default StockPrices;
