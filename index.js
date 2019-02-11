const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const expressJwt = require('express-jwt');

const app = express()
const port = 3000
//const cport = 3001

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

// user CURD 
var userCntl = require('./server/routes/user.route.js');
app.use('/users',userCntl);

//auth login register jwt
var AuthController = require('./server/controllers/auth.cntl.js');
app.use('/api/auth', AuthController);

//chat controller
var ChatController = require('./server/controllers/chat.cntl.js');
app.use('/api/chat', ChatController);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Configuring the database
const dbConfig = require('./server/config/config.js');
const mongoose = require('mongoose');

//models as schema
require('./server/models/user');
require('./server/models/conversation');
require('./server/models/message');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})

//soket io event
// var socketEvents = require('./server/config/socketEvents'); 
// const io = require('socket.io').listen(cport, (err) => {
//   if (err) {
//     return console.log('something bad happened', err)
//   }
// });
// socketEvents(io);  

//   console.log(`chat server is listening on ${cport}`)
// })