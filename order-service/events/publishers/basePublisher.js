/**
 * Base Publisher Class
 * Handles publishing events to Redis channels
 */

import redisClient from '../../config/Redis.js';

class BasePublisher {
    constructor(channel) {
        this.channel = channel;
    }

    async publish(eventType, data) {
        try {
            const eventMessage = {
                type: eventType,
                data: data,
                timestamp: new Date().toISOString(),
                service: 'order-service'
            };

            await redisClient.publish(this.channel, JSON.stringify(eventMessage));
            console.log(`Published event: ${eventType} to channel: ${this.channel}`);
        } catch (error) {
            console.error('Error publishing event:', error);
            throw error;
        }
    }
}

export default BasePublisher;