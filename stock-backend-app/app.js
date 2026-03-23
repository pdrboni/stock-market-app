import express from 'express';
import userRoutes from './routes/userRoutes.js';
import stocksRoutes from './routes/stocksRoutes.js';
import chartRoutes from './routes/chartRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import stockPricesRoutes from './routes/stockPricesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', stocksRoutes);
app.use('/api', chartRoutes);
app.use('/api', transactionRoutes);
app.use('/api', stockPricesRoutes);
app.use('/auth', authRoutes);

export default app;
