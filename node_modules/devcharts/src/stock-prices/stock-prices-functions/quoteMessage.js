export default function quoteMessage(data) {
	const quoteData = {
		symbol: data.S,
		bidPrice: data.bp,
		bidSize: data.bs,
		askPrice: data.ap,
		askSize: data.as,
	};

	return quoteData;
}

/* 
{
  "T": "q",                      // Message type: "q" stands for quote
  "S": "AMD",                   // Symbol: stock ticker symbol, e.g., AMD
  "bx": "U",                    // Bid exchange: the exchange where the best bid came from (e.g., "U" = NASDAQ)
  "bp": 87.66,                  // Bid price: the highest price someone is willing to pay
  "bs": 1,                      // Bid size: number of shares available at the bid price
  "ax": "Q",                    // Ask exchange: the exchange where the best ask came from (e.g., "Q" = NYSE)
  "ap": 87.68,                  // Ask price: the lowest price someone is willing to sell at
  "as": 4,                      // Ask size: number of shares available at the ask price
  "t": "2021-02-22T15:51:45.335689322Z", // Timestamp: when the quote was generated (ISO 8601 UTC)
  "c": ["R"],                   // Conditions: quote condition flags (e.g., "R" = regular)
  "z": "C"                      // Tape: source of the quote ("A" = NYSE, "B" = AMEX, "C" = NASDAQ)
}
*/
