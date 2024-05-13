const redis = require('redis');
const Queue = require('bull');

// Configuration Redis connection
const redisHost = process.env.REDIS_HOST || 'redis';  
const redisPort = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});

// Connect to Redis
redisClient.connect().catch(err => {
    console.error('Failed to connect to Redis:', err);
});

// Create a Bull queue that uses the same Redis instance
const myQueue = new Queue('taskQueue', {
    redis: {
        host: redisHost,
        port: redisPort
    }
});

// Function to process jobs
myQueue.process(async (job, done) => {
    console.log(`Processing job ${job.id}: ${JSON.stringify(job.data)}`);

    try {
        //  task processing 
        await new Promise(resolve => setTimeout(resolve, 2000));  

        // Update task status to 'Completed' in Redis
        await redisClient.hSet('tasks', job.data.taskId, JSON.stringify({
            ...job.data,
            status: 'Completed'
        }));
        console.log(`Completed job ${job.id} and updated status to 'Completed'`);

        done();  // Signal job completion success
    } catch (error) {

        console.error(`Failed to process job ${job.id}:`, error);
        done(error);  // Signal job processing failure
    }
});


process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await myQueue.close();
    await redisClient.quit();
    process.exit(0);
});

module.exports = { redisClient, myQueue };
