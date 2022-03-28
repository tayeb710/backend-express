const express = require('express');
const AuthController = require('./controllers/AuthController');
const morgan = require('morgan');

var cors = require('cors')


const { config } = require('./config');

async function startServer() {
  const app = express();

  if (!config.isTest) {
    app.use(morgan('combined'));
  }
  app.use(cors())

  app.use(express.json());
  app.use('/api/auth', AuthController);

  return app;
}

module.exports = {
  startServer,
};
