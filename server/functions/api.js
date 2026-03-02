const express = require('express');
const serverless = require('serverless-http');
const connectDB = require('../src/config/db');
const app = require('../src/app');

// Connect Database once per lambda execution
connectDB();

const handlerApp = express();
handlerApp.use('/', app);

const handler = serverless(handlerApp);

module.exports.handler = async (event, context) => {
    // Ensure DB is connected
    await connectDB();
    return await handler(event, context);
};
