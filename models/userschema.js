const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    currentCash: Number,
});

var GameSchema = new mongoose.Schema({
		title: {
			type: String,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		score: {
			type: Number
		},
		gamefile: {
			type: String
		},
		coverArt: {
			type: String
		},
		copiesSold:{
			type: Number
		},
		creator: {
			type: String
		}
})



// This ensures the password is encrypted before post request
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next("Hashing error:" + err);
    }
    user.password = hash;
    next();
  })
});


const User = mongoose.model('User', UserSchema);
const Game = mongoose.model('Game', GameSchema);
module.exports = User, Game
