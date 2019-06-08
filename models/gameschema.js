const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

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

const Game = mongoose.model('Game', GameSchema);
module.exports = Game
