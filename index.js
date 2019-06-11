const express = require('express');
const cloudinary = require("cloudinary").v2;
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const axios = require('axios');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const KEY = require('./config/keys');
const server = express();
const fileUpload = require('express-fileupload');

global.User = require('./models/userschema')
global.Game = require('./models/gameschema')


cloudinary.config({
  cloud_name: 'dpl1ntt00',
  api_key: KEY.CLOUDINARY_API_KEY,
  api_secret: KEY.CLOUDINARY_API_SECRET
});



///////// PORT NUMBER /////////

const PORT = process.env.PORT || 1337

//////// MONGOOSE CONFIG /////////

mongoose.Promise = global.Promise;
mongoose.connect( KEY.MONGO_URI, { useNewUrlParser: true , useCreateIndex: true } );
mongoose.set('useFindAndModify', false );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

///////// SERVER CONFIG /////////

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.set('view-engine', 'ejs');
server.use(express.static('public'));
server.use(expressSession({ secret: "anything" , saveUninitialized: false , resave: false }))

//////// SESSIONS CONFIG ////////

server.use(expressSession({
  secret: "anything" ,
  resave: true,
  saveUninitialized: false,
	maxAge: 60 * 60 * 24
}));


///////// ROUTES /////////

// Home Page
server.get('/home', (req, res) => {
	console.log( req.session.currentGameTitle );
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
	res.render('home.ejs',{
		currentGameTitle: req.session.currentGameTitle,
		currentGameFile: req.session.currentGamefile,
	 	currentGameArt: req.session.currentGameArt
	 })
});


//Sign Up
server.get('/signup', (req, res) => {
  res.render('signup.ejs', { error: "" });
});

// Log out
server.get('/signout', (req, res) => {
	req.session.success = false
  res.redirect('/signin');
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
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
	let dataFromDB = []
	Game.find({}, function( err, foundData){
		if(err){
			console.log("Error");
			console.log( err );
			foundData = ""
		} else {
			dataFromDB = foundData
			console.log( foundData);
			res.render('play.ejs', {data: dataFromDB} );
		}
	})
});

// My Demos
server.get('/mydemos', (req, res) => {
	console.log( req.session.username );
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
	let dataFromDB = []
	Game.find({creator:req.session.username}, function( err, foundData){
		if(err){
			console.log("Error");
			console.log( err );
		} else {
			dataFromDB = foundData
			console.log( " found data is ");
			console.log( foundData );
		  res.render('mydemos.ejs', {data: dataFromDB} );
		}
	})
});

// Play game method
server.post('/playthisgame', (req, res) => {
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
	console.log( "post request fired" );
	gameID = req.body.gameID
	console.log( gameID );
	Game.find({_id: gameID }, function( err, foundGame){
		if(err){
			console.log( err );
		} else {
			console.log( foundGame );
			req.session.currentGamefile = foundGame[0].gamefile
			req.session.currentGameTitle = foundGame[0].title
			req.session.currentGameArt = foundGame[0].coverArt
			res.redirect('/home');
		}
	})
});

// Delete method
server.post('/deletethisgame', (req, res) => {
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
	console.log( "delete post request fired" );
	gameID = req.body.gameID
	console.log( gameID );
	Game.deleteOne({_id: gameID }, function( err, res ){
		if(err){
			console.log( err );
			res.redirect('/home');
		} else {
			console.log("game deleted");
		}
	}).then(()=>{
		return res.redirect('/mydemos');
	})
});


// Publish Demo Page
server.get('/publish', (req, res) => {
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
  res.render('publish.ejs', { error: "" });
});

// Lets get physical
server.get('/letsgetphysical', (req, res) => {
	// if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
  res.render('letsgetphysical.ejs', { error: "" });
});


// Publish a demo
server.post('/publish', (req, res ) => {
	if (!req.session.success) {res.render('pleaselogin.ejs')} // Login Checker
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
		if (error) {
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
				req.session.currentGamefile= "https://res.cloudinary.com/dpl1ntt00/raw/upload/v1560127672/iutq9zpvxl6oxfvjv655.gb"
				req.session.currentGameTitle = "Stuff"
				req.session.currentGameArt = "https://res.cloudinary.com/dpl1ntt00/image/upload/v1560127688/crrdb2yrxbc7jqcbx3vw.jpg"
				console.log( req.session );
				res.redirect('/home')
			} else {
				req.session.success = false;
				res.render('signin.ejs', { error: "Password is incorrect" })
			}
		});
	});
})



///////// 404 CATCHER /////////
server.get('/*', (req, res) => {
  res.render('404.ejs', { error: "" });
});

///////// SERVER PORT //////////
server.listen(PORT, () => console.log(`Now showing on http://localhost:${ PORT }`));

///////// SERVER FUNCTIONS /////////






























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
		console.log("|    .     (Nintenbro)           |");
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
