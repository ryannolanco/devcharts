export default function tradeMessage(data) {
	//this will need some more computing logic, need to deterimne how many sale per price
	//and set accordingly
	const tradeData = data.data;

	const sortedTrades = tradeData.sort((a, b) => a.t - b.t);

	return sortedTrades;

	//return specific time of sales object {time: [trades], time: [trades]}
}
