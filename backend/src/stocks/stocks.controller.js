import stockService from './stocks.service';

async function stockTickerIsValid(req, res, next) {
	const stockData = await stockService.getStockQuote(req.params.ticker_id);

	if (stockData) {
		res.locals.stockData = stockData;
		return next();
	} else {
		next({
			status: 404,
			message: `Stock with ticker ${req.params.ticker_id} does not exist`,
		});
	}
}

async function getStockInformation(params) {}

module.exports = {
	list: [stockTickerIsValid],
};
