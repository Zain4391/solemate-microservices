/**
 * Redis/Valkey Configuration
 * Handles Redis client initialization and connection
 */

import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
});

// handle connection and error evens
redisClient.on('connet', () => {
    console.log(`Connected to Redis/Valkey`);
});

redisClient.on('error', (err) => {
    console.error(`Error connecting to Redis/Valkey: ${err.message}`);
});

// establish connection
await redisClient.connect();

export default redisClient;