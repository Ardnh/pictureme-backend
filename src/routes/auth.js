const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.js')
const User = require('../models/user')

const router = express.Router();

router.put('/signup',[
  body('email')
  .isEmail()
  .withMessage('Please enter a valid email')
  .custom( async (value, { req }) => {
    return User.findOne({ email: value }).then(userDoc => {
      if(userDoc){
        return Promise.reject('E-mail address already exists')
      }
    })
  })
  .normalizeEmail(),
  body('password')
  .trim()
  .isLength({ min: 5 }),
] ,authController.signup)

router.post('/login', authController.login)

module.exports = router
