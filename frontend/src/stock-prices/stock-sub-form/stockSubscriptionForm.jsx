import React from 'react';
import { useState } from 'react';
import {
	subscribeToStock,
	unsubscribeToStock,
} from '../stock-prices-functions/stockSubscriptionFunctions';

const StockSubscriptionForm = ({
	color,
	currentStocks,
	setCurrentStocks,
	connection,
}) => {
	const [tickerInput, setTickerInput] = useState('');
	const [currentTicker, setCurrentTicker] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		const nextTicker = tickerInput.toUpperCase();

		if (currentTicker) {
			unsubscribeToStock(connection, currentTicker);
		}

		setCurrentStocks({
			...currentStocks,
			[color]: nextTicker,
		});

		subscribeToStock(connection, nextTicker);
		setCurrentTicker(nextTicker);
	};

	return (
		<>
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
			<button onClick={() => console.log(connection)}>Log</button>
		</>
	);
};

export default StockSubscriptionForm;
