const mongoose = require('mongoose')
const bcrypt = require('bcrypt');



var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: false,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      require: true,
      trim: true
    },
    passwordDigest: {
      type: String,
      required: false
    },
    currentCash: Number,
    games: {
      gameUrl: String,
      description: String,
      imageUrl: String,
      currentRevenue: Number,
      stars: Number,
      copiesSold: Number
    }
});

//This ensures the password is encrypted before post request
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


module.exports = mongoose.model('Users', UserSchema)
