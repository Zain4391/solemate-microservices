import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(errorHandler());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.json({ 
      message: 'SOLEMATE User Service is running!',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        auth: '/api/auth/*'
      }
    });
  });
  
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      service: 'user-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Service running on PORT: ${PORT}`);
});