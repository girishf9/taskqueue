# Task Queue Management System

## Overview
This project implements a task queue management system using Node.js, Express, and Bull. It includes a simple front-end for adding tasks and a dashboard for monitoring these tasks.

## Setup
1. Install Node.js and Redis.
2. Clone this repository.
3. Run `npm install` to install dependencies.
4. Start Redis server.
5. Run `node server.js` to start the web server.
6. Open `http://localhost:3000` in your browser to view the dashboard.
7. To start multiple worker nodes, run `node cluster.js`.

## Features
- Add tasks via a web interface.
- Automatic distribution of tasks across multiple worker nodes.
- Dashboard for real-time monitoring of tasks.

## Dependencies
- Express
- Bull
- bull-board for monitoring

Ensure all dependencies are listed in your `package.json` and install them using npm.
#System Architecture
<img width="485" alt="image" src="https://github.com/girishf9/taskqueue/assets/60807028/3eb9e581-6596-434a-bf96-a123d6ddcac6">

<img width="468" alt="image" src="https://github.com/girishf9/taskqueue/assets/60807028/e06ba0f4-8d96-4eea-b84f-96ff5e4b8c36">
<img width="468" alt="image" src="https://github.com/girishf9/taskqueue/assets/60807028/5cdc4b2d-2733-449e-969b-4e502c6a8f9c">
<img width="468" alt="image" src="https://github.com/girishf9/taskqueue/assets/60807028/97ee4c6b-8ae5-4b58-8205-f434d01d1796">
