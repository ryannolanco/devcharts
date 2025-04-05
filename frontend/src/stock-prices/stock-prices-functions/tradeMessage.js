export default function tradeMessage(data) {
	// NEEDS VALIDATION LOGIC

	const tradeDataObject = {
		symbol: data.S,
		price: data.p,
		size: data.s,
		time: data.t,
		exchange: data.x,
	};

	return tradeDataObject;

	//return specific time of sales object {time: [trades], time: [trades]}
}

/* ----- EXAMPLE RETURN MESSAGE FOR TRADE ----- /*
/* {
//   "S": "FAKEPACA",                          // Symbol (e.g. stock ticker)
//   "T": "t",                                 // Message Type ("t" = trade)
//   "c": [" "],                               // Trade conditions (array of codes)
//   "i": 1,                                   // Trade ID (unique identifier)
//   "p": 134.56,                              // Price at which trade occurred
//   "s": 3,                                   // Size (number of shares traded)
//   "t": "2025-04-05T10:05:30.063301171Z",    // Timestamp (ISO format, UTC)
//   "x": "N",                                 // Exchange code ("N" = NYSE)
//   "z": "A"                                  // Tape ID ("A" = CTA A: NYSE & others)
*/
