import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import helmet from 'helmet';
import dotenv from 'dotenv';
import paymentRouter from './routes/PaymentRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(helmet());
app.use(errorHandler());

const PORT = process.env.PORT || 3004;

app.use('/api/payments/', paymentRouter);

app.get('/', (req, res) => {
    res.json({ 
      message: 'SOLEMATE Payment Service is running!',
      version: '1.0.0',
      endpoints: {
        health: '/health',
      }
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      service: 'payment-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });


app.listen(PORT, () => {
    console.log(`Service running on PORT: ${PORT}`);
});