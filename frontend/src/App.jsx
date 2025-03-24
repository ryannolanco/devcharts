import './App.css';
import finnhub from 'finnhub';
const FINN_API_KEY = import.meta.env.VITE_FINN_HUBB_API_KEY;

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = FINN_API_KEY; // Replace this
const finnhubClient = new finnhub.DefaultApi();

function App() {
	return <div>{import.meta.env.VITE_FINN_HUBB_API_KEY}</div>;
}

export default App;
