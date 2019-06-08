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


const User = mongoose.model('User', UserSchema);
module.exports = User
