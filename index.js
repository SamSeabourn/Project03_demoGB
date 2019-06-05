const express = require('express');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const axios = require('axios');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MONGO_CREDENTUALS = require('./keysAndThings.js');
const jwt = require('jsonwebtoken')

///////// PORT NUMBER /////////
const PORT = process.env.PORT || 1337

global.User = require('./models/schema')

//////// MONGOOSE CONFIG /////////
mongoose.Promise = global.Promise;
mongoose.connect( MONGO_CREDENTUALS.KEY, { useNewUrlParser: true , useCreateIndex: true } );
mongoose.set('useFindAndModify', false );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

///////// VIEW SETUP /////////
const server = express();
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.set('view-engine', 'ejs');
server.use(express.static('public'));

///////// SESSIONS CONFIG /////////
server.use(session({
  secret: 'HotboisAndGamerGirls',
  resave: true,
  saveUninitialized: false
}));


///////// ROUTES /////////

// Home Page
server.get('/home', (req, res) => {
	jwt.verify(req.token, 'secretKey123', (err, authData) => {
		if(err) {
			res.sendStatus(403)
		} else {
			res.json({
				authData
			})
			res.render('home.ejs');;

		}
	})
  res.render('home.ejs');;
});

//Sign Up
server.get('/signup', (req, res) => {
  res.render('signup.ejs', { error: "" });
});

// Home routed to sign in
server.get('/', (req, res) => {
  res.render('signin.ejs', { error: "" });
});

// Sign in
server.get('/signin', (req, res) => {
  res.render('signin.ejs', { error: "" });
});

// Play demos
server.get('/playdemos', (req, res) => {
  res.render('playdemos.ejs');
});

// Sign up with encrypted password
server.post('/signup', (req, res) => {
	let error = ""
  var data = req.body
	if (data.password !== data.passwordConf) {
		res.render('signup.ejs', {error:"Passwords do not match"})
	} else {
	  User.create( data , function( error ,data ){
	      if (error) {
					res.render("signup.ejs", {error: "This username or email is already in use"})
					return
	      } else {
	        console.log("data following user was added to the collection");
					console.log( data );
					res.redirect('/home')
	      }
	    })
		}
});

// Sign in with hash validation and JWT tokens and error handling
server.post('/signin', (req, res) => {
	let error = ""
	let user = req.body
	let hash = ""
	let currentUser = user.username;
	User.find({ username: user.username }, function (mongoError, mongoRes) {
		foundUser = mongoRes[0]
		if (foundUser == undefined ) {
			res.render('signin.ejs', { error: "No such user"})
			return
		}
		hash = foundUser.password
		if (mongoError) {
				res.render('signin.ejs', { error: "Looks like the database is shitting it self, well dam"})
		}
		bcrypt.compare(user.password, hash, function(bcryptError, bcryptRes) {
			if (bcryptRes) {
				console.log("Login sucessfull");
				console.log( foundUser );
				jwt.sign({ user:foundUser }, 'secretKey123', ( err, token ) => {
					res.json({
						token
					})
				})
				const verifyToken = function (req, res, next) {
					const bearerHeader = request.headers['authorization']
					if (typeof bearerHeader !== 'undefined') {
					const bearer = bearerHeader.split(' ');
					const bearerToken = bearer[1]
					req.token = bearerToken
					next()
					res.redirect('/home')

					} else {
						res.sendStatus(403)
					}
				}
			} else {
				res.render('signin.ejs', { error: "Password is incorrect"})
			}
		});
	});
})




///////// SERVER SETUP //////////
server.listen(PORT, () => console.log(`Now showing on http://localhost:${ PORT }`));

///////// CODE GRAVE YARD //////////

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
//









///////// THROW DOWN SOME GAMEBOIS /////////
const GBBOMB = () => {
		console.log(" _________________________________")
		console.log("|OFFo oON                        |");
		console.log("| .----------------------------. |");
		console.log("| |  .----------------------.  | |");
		console.log("| |  |                      |  | |");
		console.log("| |))|                      |  | |");
		console.log("| |  |                      |  | |");
		console.log("| |  |                      |  | |");
		console.log("| |  |                      |  | |");
		console.log("| |  |                      |  | |");
		console.log("| |  |                      |  | |");
		console.log("| |  '----------------------'  | |");
		console.log("| |__GAME BOY_________________/  |");
		console.log("|             ________           |");
		console.log("|    .     (Nintendo)            |");
		console.log("|  _| |_                   .-.   |");
		console.log("|-[_   _]-            .-. (   )  |");
		console.log("|   |_|              (   ) '-'   |");
		console.log("|    '                '-'   A    |");
		console.log("|                      B         |");
		console.log("|             ___   ___          |");
		console.log("|            (___) (___)     ,., |");
		console.log("|           select start    ;:;: |");
		console.log("|                         ,;:;' /");
		console.log("|                        ,;:;' /");
		console.log("|                       ,:;:' /");
		console.log("|----------------------------/");
}
