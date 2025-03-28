export default function tradeMessage(data, setMostRecentPrice) {
	//this will need some more computing logic, need to deterimne how many sale per price
	//and set accordingly
	const tradeData = data.data;

	const mostRecentTrade =
		tradeData.length > 0
			? tradeData.reduce((latest, trade) =>
					trade.t > latest.t ? trade : latest
			  )
			: null;

	setMostRecentPrice({
		price: Number(mostRecentTrade.p),
		sales: Number(tradeData.length),
	});
}
