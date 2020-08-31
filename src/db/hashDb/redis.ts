import redis from 'redis';

const REDIS_URI = 'redis://localhost:6379';

export const redisClient = redis.createClient(process.env.REDIS_URI || REDIS_URI);

export default redisClient;

export const truncateAll = (): void => {
    redisClient.flushall();
};

export const close = (): void => {
    redisClient.quit();
};
