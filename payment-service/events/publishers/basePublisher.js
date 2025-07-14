/**
 * Base Publisher Class
 * Handles publishing events to Redis channels
 */

import redisClient from "../../config/Redis.js";

class basePublisher {
    constructor(channel) {
        this.channel = channel; // the station which sends the event/publishes the event.
    }

    async publish(eventType, data) {
        try {
            const eventMessage = {
                type: eventType,
                data: data,
                timestamp: new Date().toISOString(),
                service: 'payment-service'
            }

            await redisClient.publish(this.channel, JSON.stringify(eventMessage));
            console.log(`Event: ${eventType} published to channel: ${this.channel}`);
            
        } catch (error) {
            throw new Error(`Error publishing ${eventType}: ${error.message}`);
        }
    }
}

export default basePublisher;