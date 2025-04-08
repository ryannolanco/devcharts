export default function handleTradeData(trade, tradeQueues) {
	const symbol = trade.symbol;

	// If we don't already have a queue for this stock, create one
	if (!tradeQueues[symbol]) {
		tradeQueues[symbol] = new Queue(10); // adjust size as needed
	}

	// Add new trade data to the symbol's queue
	tradeQueues[symbol].enqueue(trade);

	return tradeQueues;
}
