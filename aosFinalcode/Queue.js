const Bull = require('bull');
const REDIS_CONNECTION_STRING = 'redis://127.0.0.1:6379';
const taskManagerQueue = new Bull('taskManagerQueue', REDIS_CONNECTION_STRING);

module.exports = taskManagerQueue;
