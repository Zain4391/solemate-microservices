/**
 * Temporary event listener for testing
 * Run this in a separate terminal to see events
 */

import redisClient from "../config/Redis.js";
import { EVENT_CHANNELS } from "../events/types/eventTypes.js";

// create subscriber
const subscriber = redisClient.duplicate();
await subscriber.connect();

console.log("Listening for payment events...");

subscriber.subscribe(EVENT_CHANNELS.PAYMENTS, (message) => {
    const event = JSON.parse(message);

    const data = {
        type: event.type,
        data: event.data,
        timestamp: event.timestamp
    };

    console.log("Received Data: ", data);
    
});
