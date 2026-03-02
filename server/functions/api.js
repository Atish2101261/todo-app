const express = require('express');
const serverless = require('serverless-http');
const connectDB = require('../src/config/db');
const app = require('../src/app');

// Connect Database once per lambda execution
connectDB();

const handlerApp = express();

// The original Express app expects '/api/...'
// The incoming request path on Netlify functions will be '/.netlify/functions/api/...'
// So we mount our original 'app' under '/.netlify/functions'
handlerApp.use('/.netlify/functions', app);

module.exports.handler = serverless(handlerApp);
