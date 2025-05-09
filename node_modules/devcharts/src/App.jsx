import './App.css';
import StockPrices from './stock-prices/StockPrices';
import { BrowserRouter } from 'react-router-dom';

function App() {
	return (
		<div>
			<BrowserRouter>
				<StockPrices />
			</BrowserRouter>
		</div>
	);
}

export default App;
