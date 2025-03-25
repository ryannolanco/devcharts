import cors from 'cors';
import dotenv from 'dotenv';

const { PORT = 5001 } = process.env;
const app = require('./app');

const listener = () => console.log(`listening on port ${PORT}!`);
app.listen(PORT, listener);
