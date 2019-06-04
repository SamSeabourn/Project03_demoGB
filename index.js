const express = require('express');
const ejs = require('ejs');
const _ = require('underscore');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const MONGO_CREDENTUALS = require('./keysAndThings.js')

const PORT = process.env.PORT || 1337


global.User = require('./models/schema')

//////// MONGOOSE CONFIG /////////
mongoose.Promise = global.Promise
mongoose.connect( MONGO_CREDENTUALS.KEY, {useNewUrlParser: true} );
mongoose.set('useFindAndModify', false); // Whatever
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

// Testing adding data Params will eventualy need to passed into here
// User.create({
//     email: "sam.seabourn5@gmail.com",
//     username: "Test5",
//     password: "chicken",
//     passwordConf: "chicken",
//     currentCash: 13.50,
//     games: {
//       gameName: "Dragon Quest",
//       gameUrl: "http://cloudinary.mymadassgame.com",
//       description: "Pretty sick game that I made I guess cooleo, GG",
//       imageUrl: "http://fillmurray.com/200/200",
//       currentRevenue: 0,
//       stars: 0,
//       copiesSold: 0
//     }
//   }, function(error,data){
//     if (error) {
//       console.log("There was an error:" + error);
//     } else {
//       console.log("the following data was added to the collection:");
//       console.log( data );
//     }
//   })


///////// Views
const server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.set('view-engine', 'ejs');
server.use(express.static('public'));



///////// Routes
server.get('/', (req, res) => {
  res.render('/');
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
  var data = req.body
	if (data.password !== data.passwordConf) {
		console.log("Passwords do not match");
		res.render('signup.ejs')
	} else {
	  User.create( data , function( error ,data ){
	      if (error) {
	        console.log("There was an error bro: " + error);
	      } else {
	        console.log("data following user was added to the collection");
					console.log( data );
					res.redirect('/home')
	      }
	    })
		}
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
