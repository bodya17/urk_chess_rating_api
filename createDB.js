const mongoose = require('mongoose');
const Player = require('./models/Player');
// const players = require('./players');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/ratings');

fs.readdir('./forMongo', (err, files) => {
    files.forEach(file => {
        // console.log(file);
        var players = require('./forMongo/' + file)
        players.forEach(player => {
            const newPlayer = new Player(player);
            newPlayer.save();  
        });
    });
});

// players.forEach(player => {
//     const newPlayer = new Player(player);
//     newPlayer.save();  
// });

mongoose.disconnect();


