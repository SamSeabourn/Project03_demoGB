const express = require('express');
const ejs = require('ejs');
const _ = require('underscore');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 1337


global.User = require('./models/schema')

//////// MONGOOSE CONFIG /////////
mongoose.Promise = global.Promise
////
mongoose.connect('mongodb+srv://Sam:testing1234@demogb-kmxfo.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
////
mongoose.set('useFindAndModify', false); // Whatever
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});


///////// Views
const server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.set('view-engine', 'ejs');
server.use(express.static('public'));


server.get('/', (req, res) => {
  res.render('signin.ejs');
});

server.get('/home', (req, res) => {
  res.render('home.ejs');;
});

server.get('/signup', (req, res) => {
  res.render('signup.ejs');
});

server.get('/', (req, res) => {
  res.render('home.ejs');
});

server.get('/signin', (req, res) => {
  res.render('signin.ejs');
});

server.get('/playdemos', (req, res) => {
  res.render('playdemos.ejs');
});

server.post('/signup', (req, res) => {
  let data = req.body
  console.log( data );
  User.create( { data }, function(error,data){
      if (error) {
        console.log("There was and error" + error);
      } else {
        console.log("data was added to the collection");
      }
    } )
});




server.listen(PORT, () => console.log(`Now showing on http://localhost:${ PORT }`));






//Code grave

//////Mongo DB Connection via Mongo docs
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Sam:testing1234@demogb-kmxfo.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



////
// var UserSchema = new mongoose.Schema({
//     username: String,
//     passwordDigest: String,
//     currentCash: Number,
//     games: {
//       gameUrl: String,
//       description: String,
//       imageUrl: String,
//       currentRevenue: Number,
//       stars: Number,
//       copiesSold: Number
//     }
//   });
//
// var user = mongoose.model("User" , UserSchema )
//////////
/////// Create user
// user.create({
//     username: "Test2",
//     passwordDigest: "chicken",
//     currentCash: 13.50,
//     games: {
//       gameUrl: "",
//       description: "",
//       imageUrl: "",
//       currentRevenue: 0,
//       stars: 0,
//       copiesSold: 0
//     }
//   }, function(error,data){
//     if (error) {
//       console.log("There was and error" + error);
//     } else {
//       console.log("data was added to the collection");
//     }
//   } )
