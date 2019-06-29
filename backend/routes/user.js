const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const USER = require('../models/user');
const JWT = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new USER({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: 'Invalid authentification credentials!'
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  USER.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed, user doesn't exist"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed, cretentials didn't match"
        });
      }
      const token = JWT.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Auth failed'
      });
    });
});

module.exports = router;
