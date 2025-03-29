import React, { useEffect, useRef, useState } from 'react';
import tradeMessage from './stock-prices-functions/tradeMessageLogic';

const apiURL = import.meta.env.VITE_FINN_HUBB_API_URL;

const StockPrices = () => {
	const connection = useRef(null);

	const [stockName, setStockName] = useState('');
	const [tickerInput, setTickerInput] = useState('');
	const [oldTicker, setOldTicker] = useState('');

	const [trades, setTrades] = useState([]);

	useEffect(() => {
		console.log(apiURL);

		const socket = new WebSocket(apiURL);

		socket.addEventListener('open', (event) => {
			console.log('WebSocket connected');
		});

		socket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data);

			if (data.type === 'trade') {
				const tosObject = tradeMessage(data);
				// logic for updating queue, a forEach to loop over tosObject and extract time array items.
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
		console.log(`subscribing to ${symbol}`);
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

	return (
		<div>
			<div>
				Latest Trade
				<div key={stockName}>
					<h4>Stock: {stockName}</h4>
					<p>Price: {mostRecentPrice ? mostRecentPrice.price : null}</p>
					<p>Sales: {mostRecentPrice ? mostRecentPrice.sales : null}</p>
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
