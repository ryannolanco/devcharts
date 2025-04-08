export function subscribeToStock(connection, symbol) {
	console.log(`Subscribing to ${symbol}`);
	setStockName(symbol);

	const subscribeMsg = {
		action: 'subscribe',
		trades: [symbol],
		quotes: [symbol],
		bars: [symbol],
	};

	if (connection.current && connection.current.readyState === WebSocket.OPEN) {
		connection.current.send(JSON.stringify(subscribeMsg));
	}
}

export function unsubscribeToStock(connection, symbol) {
	console.log(`Unsubscribing from ${symbol}`);
	const unsubscribeMsg = {
		action: 'unsubscribe',
		trades: [symbol],
		quotes: [symbol],
		bars: [symbol],
	};

	if (connection.current && connection.current.readyState === WebSocket.OPEN) {
		connection.current.send(JSON.stringify(unsubscribeMsg));
	}
}
