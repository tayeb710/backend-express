const { dbConnector } = require('./db/dbConnector');
const { startServer } = require('./server');
const { config } = require('./config');

async function start() {
  try {
    await dbConnector();

    const app = await startServer();
    app.listen(config.port, () => {
      console.log('CovidPath API started and listening on port:', config.port);
    });
  } catch (e) {
    console.error(e);
  }
}

start();
