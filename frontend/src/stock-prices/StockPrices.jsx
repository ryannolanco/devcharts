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

	const [stockName, setStockName] = useState('');
	const [currentTicker, setCurrentTicker] = useState('');

	// current subscriptions object to handle more robust data
	const [subscriptions, setSubscriptions] = useState({});
	const tradeQueues = {}; // Each key will be a stock symbol like "AAPL", "TSLA", etc.

	const [trades, setTrades] = useState({});
	const [quote, setQuote] = useState({});

	useEffect(() => {
		const socket = new WebSocket('wss://stream.data.alpaca.markets/v2/test');
		// const socket = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

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
						//need individual stock object for each subscription
						const tosObject = tradeMessage(item);
						const symbol = tosObject.symbol;
						tradeQueues = handleTradeData(tosObject, tradeQueues);
						// Access recent trades for this stock
						const recentTrades = tradeQueues[tosObject.symbol].getItems();
						setTrades({ ...trades, [symbol]: recentTrades });
						console.log(recentTrades);
					}

					if (item.T === 'q') {
						const quoteObj = quoteMessage(item);
						setQuote(quoteObj);
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

	// const mappedTrades = trades.map((trade, index) => {
	// 	return (
	// 		<li key={index}>
	// 			<p>
	// 				Index: {index + 1} | Symbol: {trade.symbol} | Price: {trade.price} |
	// 				Size: {trade.size} | Time: {new Date(trade.time).toLocaleTimeString()}
	// 			</p>
	// 		</li>
	// 	);
	// });

	return (
		<div>
			<h2>Latest Trade</h2>
			<div className="current-price">
				<p>Bid:{quote.bidPrice}</p>
				<p>Size:{quote.bidSize}</p>
				<p>Ask:{quote.askPrice}</p>
				<p>Size:{quote.askSize}</p>
				<StockSubscriptionForm
					setSubscriptions={setSubscriptions}
					subscriptions={subscriptions}
					setStockName={setStockName}
					connection={connection}
				/>
			</div>
			<div key={stockName}>
				<h4>Stock: {stockName}</h4>
				{/* <ul>{mappedTrades}</ul> */}
				TEST
			</div>
		</div>
	);
};

export default StockPrices;
