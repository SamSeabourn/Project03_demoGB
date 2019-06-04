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
    passwordConf: {
      type: String,
      required: true
    },
    currentCash: Number,
    games: {
      gameName: {
        type: String,
        unique: true
      },
      gameUrl: String,
      description: String,
      imageUrl: String,
      currentRevenue: Number,
      stars: Number,
      copiesSold: Number
    }
});



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
module.exports = User
