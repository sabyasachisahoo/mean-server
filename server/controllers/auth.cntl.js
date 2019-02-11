var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require('./VerifyToken');

const User = require('../models/user.js');
const config = require('../config/config.js');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

router.post('/register', function(req, res) {
  
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  User.create({
    username : req.body.username,
    password : hashedPassword,
    email : req.body.email 
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user.")
    // create a token
    
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 * 10 // expires in 24 hours
    });
    res.status(200).send({auth:true,token :token });
    //res.status(200).send(token);
  }); 
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) 
        return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 * 10 // expires in 240 hours
    });
    res.status(200).send({auth : true,token :token });
    //res.status(200).send(token);
  });
});

router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    //res.status(200).send(decoded);
    User.findById(decoded.id,{ password: 0 }, // projection - not to show password
         function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
     
        res.status(200).send(user);
         //next(user); 
        });
    });
});


 router.get('/logout', function(req, res) {
    res.status(200).send({auth:false , token: null });
});

router.get('/me', VerifyToken, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    
    res.status(200).send(user);
  });
});

module.exports = router;