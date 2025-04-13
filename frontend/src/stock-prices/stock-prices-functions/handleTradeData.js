import Queue from '../../classes/Queue';

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

// This is the trade info: {"FAKEPACA":[{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:10.732701113Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:15.733046882Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:20.732636172Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:25.733210602Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:30.734630762Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:35.732393171Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,"size":3,"time":"2025-04-13T05:23:40.732493431Z","exchange":"N"},{"symbol":"FAKEPACA","price":134.56,
// "size":3,"time":"2025-04-13T05:23:45.732386251Z","exchange":"N"}]}}
