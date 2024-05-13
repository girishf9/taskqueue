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
