import React, { useEffect, useRef, useState } from 'react';
import tradeMessage from './stock-prices-functions/tradeMessage';
import Queue from '../classes/Queue';

const ALPACA_API_KEY_ID = import.meta.env.VITE_ALPACA_API_KEY_ID;
const ALPACA_API_SECRET_ID = import.meta.env.VITE_ALPACA_API_SECRET_ID;

const StockPrices = () => {
	const connection = useRef(null);

	const [stockName, setStockName] = useState('');
	const [tickerInput, setTickerInput] = useState('');
	const [oldTicker, setOldTicker] = useState('');

	const [trades, setTrades] = useState([]);

	const tradeQueue = new Queue(10);

	useEffect(() => {
		// const socket = new WebSocket(apiURL);
		const socket = new WebSocket('wss://stream.data.alpaca.markets/v2/test');

		socket.addEventListener('open', (event) => {
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

			const subscribeMsg = { action: 'subscribe', trades: ['FAKEPACA'] };

			if (data[0]?.msg === 'authenticated') {
				socket.send(JSON.stringify(subscribeMsg));
			}

			// if (data.type === 'trade') {
			// 	const tosObject = tradeMessage(data);

			// 	tosObject.forEach((item) => {
			// 		tradeQueue.enqueue(item);
			// 	});

			// 	setTrades(tradeQueue.getItems());
			// 	// logic for updating queue, a forEach to loop over tosObject and extract time array items.
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
		console.log(`subscribing to ${symbol}`);
		setStockName(symbol);
		connection.current.send(
			JSON.stringify({ type: 'subscribe', symbol: symbol })
		);
	};

	const unsubscribeToStock = (symbol) => {
		// setMostRecentPrice(null);
		setStockName('');
		connection.current.send(
			JSON.stringify({ type: 'unsubscribe', symbol: symbol })
		);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(`old: ${oldTicker}`);
		console.log(`ticker input: ${tickerInput}`);
		if (oldTicker) {
			console.log('unsbcribing');
			unsubscribeToStock(oldTicker);
		}
		setOldTicker(tickerInput);
		setTickerInput('');
		subscribeToStock(tickerInput);
	};
	// lets move the form logic over to a new form file

	const mappedTrades = trades.map((trade, index) => {
		return (
			<li key={index}>
				<p>
					Ticker: {trade.s} Price: {trade.p} Time: {trade.t}
				</p>
			</li>
		);
	});

	return (
		<div>
			<div>
				Latest Trade
				<div key={stockName}>
					<h4>Stock: {stockName}</h4>
					<ul>{mappedTrades}</ul>
				</div>
			</div>
			<button onClick={() => console.log(`debugging log`)}>Log</button>
			<form onSubmit={handleSubmit}>
				<label htmlFor="stock_ticker">Stock Ticker:</label>
				<input
					id="stock_ticker"
					type="text"
					name="stock_ticker"
					value={tickerInput}
					onChange={({ target }) => {
						console.log(tickerInput);
						setTickerInput(target.value);
					}}
				/>
			</form>
		</div>
	);
};

export default StockPrices;
