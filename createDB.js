const mongoose = require('mongoose');
const Player = require('./models/Player');
// const players = require('./players');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/ratings_2017_01');

fs.readdir('./forMongo', (err, files) => {
  files.forEach((file) => {
    const players = require('./forMongo/' + file);
    players.forEach((player) => {
      const { title, gamesPlayed, ratingChange,
                    ukrRating, fideRating, expireDate } = player;
      const ratingInfo = {
        title,
        gamesPlayed,
        ratingChange,
        ukrRating,
        fideRating,
        expireDate,
        date: new Date('01.01.17'),
      };
      const { lastName, firstName, dob, IDF, fed } = player;
      const playerInfo = {
        lastName,
        firstName,
        dob,
        IDF,
        fed,
        ratings: ratingInfo,
      };
      const newPlayer = new Player(playerInfo);
      newPlayer.save();
    });
  });
});

// players.forEach(player => {
//     const newPlayer = new Player(player);
//     newPlayer.save();
// });

mongoose.disconnect();

