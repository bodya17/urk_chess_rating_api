const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  dob: { type: Date },
  IDF: { type: String },
  fed: { type: String },
  ratings: [{
    title: { type: String },
    gamesPlayed: { type: Number },
    ratingChange: { type: Number },
    ukrRating: { type: Number },
    fideRating: { type: Number },
    expireDate: { type: Date },
    date: { type: Date },
  }],

});

const Player = mongoose.model('Players', playerSchema);
module.exports = Player;
