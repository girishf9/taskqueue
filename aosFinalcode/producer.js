const redis = require('redis');
const Queue = require('bull');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

// Initialize Redis client
const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});
redisClient.connect();

const myQueue = new Queue('taskQueue', {
    redis: {
        host: redisHost,
        port: redisPort
    }
});

const addTaskToQueue = async (taskData) => {
    const job = await myQueue.add(taskData);
    console.log(`Added job ${job.id} to the queue`);
    return job;
};

module.exports = addTaskToQueue;
