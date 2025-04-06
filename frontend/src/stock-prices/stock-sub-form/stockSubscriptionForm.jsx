import React from 'react';
import { useState } from 'react';

const stockSubscriptionForm = ({ subscriptions, setSubscriptions }) => {
	const [tickerInput, setTickerInput] = useState('');

	const handleSubmit = (e, connection, key) => {
		e.preventDefault();
		const currentTicker = subscriptions[key];
		const nextTicker = tickerInput.toUpperCase();

		if (currentTicker) {
			unsubscribeToStock(connection, currentTicker);
		}

		setSubscriptions({
			...subscriptions,
			[key]: nextTicker,
		});

		subscribeToStock(connection, nextTicker);
	};

	return (
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
	);
};

export default stockSubscriptionForm;
