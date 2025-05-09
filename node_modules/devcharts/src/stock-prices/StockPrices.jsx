import React, { useEffect, useRef, useState } from 'react';
import tradeMessage from './stock-prices-functions/tradeMessage';
import Queue from '../classes/Queue';
import quoteMessage from './stock-prices-functions/quoteMessage';
import StockSubscriptionForm from './stock-sub-form/StockSubscriptionForm';

import './stockprices.css';
import handleTradeData from './stock-prices-functions/handleTradeData';

const ALPACA_API_KEY_ID = import.meta.env.VITE_ALPACA_API_KEY_ID;
const ALPACA_API_SECRET_ID = import.meta.env.VITE_ALPACA_API_SECRET_ID;

const StockPrices = () => {
	const connection = useRef(null);

	// current subscriptions object to handle more robust data
	let tradeQueues = {}; // Each key will be a stock symbol like "AAPL", "TSLA", etc.
	const [currentStocks, setCurrentStocks] = useState({});
	const [trades, setTrades] = useState({});
	const [quotes, setQuotes] = useState({});

	useEffect(() => {
		const socket = new WebSocket('wss://stream.data.alpaca.markets/v2/test');
		// const socket = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

		connection.current = socket;
		console.log(connection);

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

				if (currentStocks.length) {
					const currentTickers = Object.values(currentStocks);

					const subscribeMsg = {
						action: 'subscribe',
						trades: [...currentTickers],
						// quotes: [currentTicker],
						// bars: [currentTicker],
					};
					socket.send(JSON.stringify(subscribeMsg));
				}

				return;
			}

			// Handle trade data
			setTrades((prevTrades) => {
				const updated = { ...prevTrades };

				data.forEach((item) => {
					if (item.T === 't') {
						const tosObject = tradeMessage(item);
						const symbol = tosObject.symbol;

						tradeQueues = handleTradeData(tosObject, tradeQueues);
						const recentTrades = tradeQueues[symbol].getItems();

						updated[symbol] = recentTrades;
					}
				});

				return updated;
			});

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
	}, []);

	const redSymbol = currentStocks['red'];

	const sortedRedTrades = (trades[redSymbol] || [])
		.slice() // shallow copy to avoid mutating state
		.sort((a, b) => new Date(b.time) - new Date(a.time));

	const mappedRedTrades = sortedRedTrades.map((tempTrade, i) => (
		<li key={`${tempTrade.symbol}-${tempTrade.time}-${i}`}>
			<p>
				Index: {i + 1} | Symbol: {tempTrade.symbol} | Price: {tempTrade.price} |
				Size: {tempTrade.size} | Time:{' '}
				{new Date(tempTrade.time).toLocaleTimeString()}
			</p>
		</li>
	));

	const blueSymbol = currentStocks['blue'];

	const sortedBlueTrades = (trades[blueSymbol] || [])
		.slice() // shallow copy to avoid mutating state
		.sort((a, b) => new Date(b.time) - new Date(a.time));

	const mappedBlueTrades = sortedBlueTrades.map((tempTrade, i) => (
		<li key={`${tempTrade.symbol}-${tempTrade.time}-${i}`}>
			<p>
				Index: {i + 1} | Symbol: {tempTrade.symbol} | Price: {tempTrade.price} |
				Size: {tempTrade.size} | Time:{' '}
				{new Date(tempTrade.time).toLocaleTimeString()}
			</p>
		</li>
	));

	return (
		<div>
			{/* <h2>Latest Trade</h2>
			<div className="current-price">
				<p>Bid:{quote.bidPrice}</p>
				<p>Size:{quote.bidSize}</p>
				<p>Ask:{quote.askPrice}</p>
				<p>Size:{quote.askSize}</p>
			</div> */}
			<StockSubscriptionForm
				color={'red'}
				currentStocks={currentStocks}
				setCurrentStocks={setCurrentStocks}
				connection={connection}
			/>
			<div key="red">
				<h4>Stock: {currentStocks['red']}</h4>
				<ul>{mappedRedTrades}</ul>
			</div>
			<StockSubscriptionForm
				color={'blue'}
				currentStocks={currentStocks}
				setCurrentStocks={setCurrentStocks}
				connection={connection}
			/>
			<div key="blue">
				{/* <h4>Stock: {stockName}</h4> */}
				<ul>{mappedBlueTrades}</ul>
				TEST
			</div>
		</div>
	);
};

export default StockPrices;
