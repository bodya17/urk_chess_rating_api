const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    title: { type: String },
    gamesPlayed: { type: Number },
    ratingChange: { type: Number },
    ukrRating: { type: Number },
    fideRating: { type: Number },
    dob: { type: Date },
    IDF: { type: String },
    expireDate: { type: Date }
});


const Player = mongoose.model('Author', playerSchema);
module.exports = Player;