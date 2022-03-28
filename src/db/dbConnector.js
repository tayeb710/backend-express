const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test','', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: '3306',
  logging: false,
});

async function dbConnector() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  return sequelize;
}

module.exports = {
  dbConnector,
  sequelize,
};
