const express = require('express');
const redis = require('redis');
const app = express();
const scheduleTask = require('./producer');

//use default
const port = process.argv[2] || 3000;

// Configure Redis client to use environment variables
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
});

// Connect to Redis
redisClient.connect();

// Function to clear the task store
async function resetTaskStore() {
    await redisClient.del('tasks');
}

// Function to mark all pending tasks as canceled
async function markPendingTasksAsCancelled() {
    const tasks = await redisClient.hVals('tasks');
    const pendingTasks = tasks.map(task => JSON.parse(task)).filter(task => task.status === 'Added');
    for (let task of pendingTasks) {
        task.status = 'Cancelled';
        await redisClient.hSet('tasks', task.taskId, JSON.stringify(task));
    }
}

// Reset tasks and set pending tasks to cancelled on server start
async function initializeServer() {
    await resetTaskStore();
    await markPendingTasksAsCancelled();
    app.listen(port, () => console.log(`Server is running on port ${port}`));
}

// Start the server
initializeServer();

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle task creation
app.post('/task', async (req, res) => {
    const { taskId, description } = req.body;
    const taskDetails = { taskId, description, status: 'Added' };
    await redisClient.hSet('tasks', taskId, JSON.stringify(taskDetails));
    await scheduleTask(taskDetails);
    setTimeout(() => modifyTaskStatus(taskId, 'Processed'), 5000);
    res.send('Task has been successfully added');
});

// Function to update task status
function modifyTaskStatus(taskId, newStatus) {
    redisClient.hGet('tasks', taskId, async (err, taskData) => {
        if (err) {
            console.error('Error fetching task:', err);
            return;
        }
        let task = JSON.parse(taskData);
        task.status = newStatus;
        await redisClient.hSet('tasks', taskId, JSON.stringify(task));
        if (newStatus === 'Processed') {
            setTimeout(() => modifyTaskStatus(taskId, 'Completed'), 5000);
        }
    });
}

// Route to fetch tasks based on their status
app.get('/tasks', async (req, res) => {
    const { status } = req.query;
    const allTasks = await redisClient.hVals('tasks');
    const tasks = allTasks.map(task => JSON.parse(task)).filter(task => task.status === status);
    res.json(tasks);
});

// Route to fetch system logs
app.get('/system-logs', async (req, res) => {
    const tasks = await redisClient.hVals('tasks');
    const logs = tasks.map(task => JSON.parse(task)).map(task => `Task ID: ${task.taskId} - Description: ${task.description} - Status: ${task.status}`);
    res.json(logs);
});



