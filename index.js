const express = require('express');
const cloudinary = require("cloudinary").v2;
const cloudinaryStorage = require("multer-storage-cloudinary");
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const axios = require('axios');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const SECRET = require('./keysAndThings.js')
const server = express();
const fileUpload = require('express-fileupload')
const multer = require('multer');


global.User = require('./models/userschema')
global.Game = require('./models/gameschema')


var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|gb)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
var upload = multer({ storage: storage })

const CLOUDINARY_API_KEY = 268751858638495
const CLOUDINARY_API_SECRET = "8rJh9MIPVL0CxwQ0KwfdU2lxBTE"

cloudinary.config({
  cloud_name: 'dpl1ntt00',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});



///////// PORT NUMBER /////////

const PORT = process.env.PORT || 1337

//////// MONGOOSE CONFIG /////////

mongoose.Promise = global.Promise;
mongoose.connect( SECRET.KEY, { useNewUrlParser: true , useCreateIndex: true } );
mongoose.set('useFindAndModify', false );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

///////// SERVER CONFIG /////////

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.set('view-engine', 'ejs');
server.use(express.static('public'));
// server.use(fileUpload());
server.use(expressSession({ secret: SECRET.KEY , saveUninitialized: false , resave: false }))

//////// SESSIONS CONFIG ////////

server.use(expressSession({
  secret: SECRET.KEY ,
  resave: true,
  saveUninitialized: false,
	maxAge: 60 * 60 * 24
}));

///////// CLOUDINARY CONFIG ////////
//

// cloudinary.config({
//   cloud_name: 'dpl1ntt00',
//   api_key: '268751858638495',
//   api_secret: '8rJh9MIPVL0CxwQ0KwfdU2lxBTE'
// });



///////// ROUTES /////////

// Home Page
server.get('/home', (req, res) => {
	// if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
		res.render('home.ejs')
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
server.get('/play', (req, res) => {
	// if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
  res.render('play.ejs');
});

// My Demos
server.get('/mydemos', (req, res) => {
	let dataFromDB =[]
	Game.find({creator:req.session.username}, function( err, foundData){
		if(err){
			console.log("Error");
			console.log( err );
		} else {
			console.log( "Found" );
			console.log( foundData );
			dataFromDB = foundData
		  res.render('mydemos.ejs', {data: dataFromDB} );
		}
	})
  // res.render('mydemos.ejs', { data: dataFromDB });
});

// Publish Game Page
server.get('/publish', (req, res) => {
	// if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
  res.render('publish.ejs', { error: "" });
});

// Publish a demo
server.post('/publish', (req, res ) => {
	// if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
	let pageData = req.body
	let data = {
		title: pageData.title,
		score: 0,
		description: pageData.description,
		gamefile: pageData.gamefile,
		coverArt: pageData.coverArt,
		copiesSold: 0,
		creator: req.session.username
	}
	Game.create( data , function( error ,data ){
		if (error.code === 11000) {
			res.render("publish.ejs", {error: `A game with the name ${ data.title } has already been made, please reupload with a different title` })
			console.log( error );
		} else {
			res.render("publish.ejs", {error: "Upload complete"} )
		}
	})
	res.redirect('/mydemos')
});

// Sign up with encrypted password
server.post('/signup', (req, res) => {
	let error = ""
  const data = req.body // Changed this to Let from Var .... May break things but probs not.
	if (data.password !== data.passwordConf) {
		res.render('signup.ejs', {error:"Passwords do not match"})
	} else {
	  User.create( data , function( error ,data ){
	      if (error) {
					res.render("signup.ejs", {error: "This username or email is already in use"})
					return
	      } else {
					res.redirect('/signin')
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
				res.render('signin.ejs', { error: "Looks like the database is crapping it self, well dam"})
				return
		}
		bcrypt.compare(user.password, hash, function(bcryptError, bcryptRes) {
			if (bcryptRes) {
				req.session.success = true;
				req.session.username = currentUser
				res.redirect('/home')
			} else {
				req.session.success = false;
				res.render('signin.ejs', { error: "Password is incorrect"})
			}
		});
	});
})



///////// 404'd /////////
server.get('/*', (req, res) => {
  res.render('404.ejs', { error: "" });
});

///////// SERVER PORT //////////
server.listen(PORT, () => console.log(`Now showing on http://localhost:${ PORT }`));

///////// SERVER FUNCTIONS /////////












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
//////////////////
// console.log("Login sucessfull");
// console.log( foundUser );
// jwt.sign({ foundUser }, secret, ( err, token ) => {
// 	console.log( "The token is " + token );
// 	res.json({
// 		token
// 	})
// })
// CREATES A JWT TOKEN
// const createToken = () => {
// 	let token = jwt.sign({ foundUser }, secret )
// 	console.log("The token is");
// 	console.log( token );
// 	return token
// }

// Token Verifier
// const verifyToken = function (req, res, next) {
// 	const bearerHeader = request.headers['authorization']
// 	if (typeof bearerHeader !== 'undefined') {
// 	const bearer = bearerHeader.split(' ');
// 	const bearerToken = bearer[1]
// 	req.token = bearerToken
// 	next()
// 	} else {
// 		res.sendStatus(403)
// 	}
// }
// const storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
//
// const upload = multer({ storage: storage })

// const storage = cloudinaryStorage({
// 	cloudinary: cloudinary,
// 	folder: "demo",
// 	allowedFormats: ["jpg", "png", "gb"],
// 	transformation: [{ width: 500, height: 500, crop: "limit" }]});


// const CLOUD_NAME = "dpl1ntt00"
// const API_KEY = "914122464552653"
// const API_SECRET = "u3WPB2RqNcDBmkiN7Mc5v-dOpV0"
// const parser = multer({ storage: storage });







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
