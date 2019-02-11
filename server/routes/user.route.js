//var userService = require('../services/user.service');
const User = require('../models/user.js');
var express = require('express');
var router = express.Router();

//const users = require('../controllers/user.cntl.js');

    // Retrieve all user
    router.get('/fetch', findAll);

    // Retrieve a single user with userId
    //router.get('/:userId',findOne);

    router.get('/:username',findByUsername);

    // Update a Note with userId
    router.put('/:userId', update);

    // Delete a Note with userId
    router.delete('/:userId', deleteById);

module.exports = router;

function findAll(req,res){
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
}

// function findOne(req,res){
//     User.findById(req.params.id, function (err, user) {
//         if (err) return res.status(500).send("There was a problem finding the user.");
//         if (!user) return res.status(404).send("No user found.");
//         res.status(200).send(user);
//     });
// }

function findByUsername(req,res){
    var name = req.params.username;
    console.log(name)
    User.find({"username": name}, function(err,user){
    //response.render('userprofile', { "user": user });
    if (!user) return res.status(404).send("No user found.");
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
    });
}

function deleteById(req,res){
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
}

function update(req,res){
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
}
