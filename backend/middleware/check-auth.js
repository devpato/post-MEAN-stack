const JWT = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const TOKEN = req.headers.authorization.split('')[1];
    JWT.verify(TOKEN, 'secret_this_should_be_longer');
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth Faild!'
    });
  }
};
