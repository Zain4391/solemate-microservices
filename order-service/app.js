import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cartRouter from './routes/carRoutes.js';
import orderRouter from './routes/orderRoutes.js';

import paymentListener from "./events/listeners/paymentListener.js";



dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(errorHandler());

const PORT = process.env.PORT || 3003;

app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.get('/', (req, res) => {
    res.json({ 
      message: 'SOLEMATE Order Service is running!',
      version: '1.0.0',
      endpoints: {
        health: '/health',
      }
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      service: 'order-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });


app.listen(PORT, () => {
    console.log(`Service running on PORT: ${PORT}`);
    paymentListener.listen();
    console.log(`Order Listener started!`);
});