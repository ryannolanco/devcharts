import finnhub from 'finnhub';
import dotenv from 'dotenv';

dotenv.config();

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINN_HUBB_API_KEY;

const finnhubClient = new finnhub.DefaultApi();

const getStockQuote = async (symbol) => {
	return new Promise((resolve, reject) => {
		finnhubClient.quote(symbol, (error, data) => {
			if (error) reject(error);
			else resolve(data);
		});
	});
};

export default { getStockQuote };
