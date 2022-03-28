const isTest = ['test', 'testing'].includes(process.env.NODE_ENV);
const isProd = ['production', 'prod'].includes(process.env.NODE_ENV);
const isDev = ['dev', 'development'].includes(process.env.NODE_ENV);
const port = process.env.PORT || 8083;

module.exports.config = {
  isTest,
  isDev,
  isProd,
  port,
};
