import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import helmet from 'helmet';
import dotenv from 'dotenv';

import productRouter from './routes/productRoutes.js';
import orderListener from "./events/listeners/orderListener.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(errorHandler());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res) => {
    res.json({ 
      message: 'SOLEMATE Product Service is running!',
      version: '1.0.0',
      endpoints: {
        health: '/health',
      }
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      service: 'product-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.use('/api/products', productRouter);

app.listen(PORT, () => {
    console.log(`Service running on PORT: ${PORT}`);
    orderListener.listen();
    console.log(`Product Service listener started`);
});