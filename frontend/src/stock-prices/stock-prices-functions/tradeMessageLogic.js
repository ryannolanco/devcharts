export default function tradeMessage(data) {
	//this will need some more computing logic, need to deterimne how many sale per price
	//and set accordingly
	const tradeData = data.data;

	const mostRecentTrade =
		tradeData.length > 0
			? tradeData.reduce((latest, trade) =>
					trade.t > latest.t ? trade : latest
			  )
			: null;

	//return specific time of sales object {time: [trades], time: [trades]}

	return; //time of sales object
}
