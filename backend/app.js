const EXPRESS = require('express');

const APP = EXPRESS();

APP.use((req, res, next) => {
  console.log('First Middleware');
  next();
});

APP.use((req, res, next) => {
  res.send('Hello from express!');
});

module.exports = APP;
