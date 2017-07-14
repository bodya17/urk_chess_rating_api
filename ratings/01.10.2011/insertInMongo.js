const mongoose = require('mongoose');
const Player = require('../../models/Player');
const fs = require('fs');

console.log(Player);
mongoose.connect('mongodb://localhost:27017/ratings_nested');
mongoose.Promise = global.Promise;

fs.readdir('./forMongo', (err, files) => {
  // files.forEach((file) => {
    console.log(files);
  for (const file of files) {
    console.log(file);
    // 1. find player with fisrtName and lastName and Birthday
    // 2. if such player exists append rating to ratings array
    // 3. if such player doesnot exists - create new player

    const players = require(`./forMongo/${file}`);
    // players.forEach(async (player) => {
    for (const player of players) {
      const { title, gamesPlayed, ratingChange,
                    ukrRating, fideRating, expireDate } = player;
      const ratingInfo = {
        title,
        gamesPlayed,
        ratingChange,
        ukrRating,
        fideRating,
        expireDate,
        date: new Date('01.10.11'),
      };
      const { lastName, firstName, dob, IDF, fed } = player;


      const playerFromDB = Player.findOneAndUpdate({
        lastName,
        firstName,
        dob,
      }, { $push: { ratings: ratingInfo } }).exec();
      console.log(playerFromDB);
      // if (playerFromDB) { // then append ratingInfo to ratings field
      //   console.log('appending');
      //   // Player.findByIdAndUpdate(playerFromDB._id, { $push: { ratings: ratingInfo } }).exec();
      //   const updatedPlayer = await Player.findOneAndUpdate(
      //     { _id: playerFromDB._id },
      //     { $push: { ratings: ratingInfo } },
      //     { new: true }).exec();
      //   // Player.find()
      //   console.log('updated player');
      //   console.log(updatedPlayer);
      // } else {
      //   const playerInfo = {
      //     lastName,
      //     firstName,
      //     dob,
      //     IDF,
      //     fed,
      //     ratings: ratingInfo,
      //   };
      //   console.log('new Player');

      //   const newPlayer = new Player(playerInfo);
      //   await newPlayer.save();
      // }
    }
  }
});

// mongoose.disconnect();

