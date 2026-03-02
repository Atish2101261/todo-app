const express = require('express');
const serverless = require('serverless-http');
const connectDB = require('../src/config/db');
const app = require('../src/app');

// Connect Database once per lambda execution
connectDB();

const handlerApp = express();

// Instead of putting everything under `/.netlify/functions`,
// and since the `netlify.toml` redirects `/api/*` to `/.netlify/functions/api/:splat`
// The handler needs to just run the `app` natively. `serverless-http` handles the pathing.
handlerApp.use('/', app);

module.exports.handler = serverless(handlerApp);
