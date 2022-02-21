const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

exports.signup = (req, res, next) => {
  const error = validationResult(req)
  if(!error.isEmpty()){
    res.json('Validation failed!!')
  }
  const { username, email, password } = req.body
  console.log(req.body)
  bcrypt.hash( password, 12 ).then(hashedPwd => {
    const user = new User({
      username,
      email,
      password: hashedPwd
    })
    return user.save()
  }).then(result => {
    res.status(201).json({ message: 'user created', userId: result._id })
  }).catch( err => console.log(err))
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body)
  let loadedUser;
  User.findOne({ email })
    .then(user => {
    if(!user){
        res.json(`User dengan email ${ email } tidak ditemukan!`)
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
      if(!isEqual){
        res.json({ message: "password yang anda masukan salah" })
      }
      const token = jwt.sign({
        email: loadedUser.email,
        userId: loadedUser._id.toString()
      }, process.env.JWT_SIGNATURE,
      { expiresIn: '5h' })

      res.status(201).json({
        message: 'berhasil login',
        token: token,
        userId: loadedUser._id.toString() 
      })
    })
}
