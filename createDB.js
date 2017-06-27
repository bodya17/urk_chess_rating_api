const mongoose = require('mongoose');
const Player = require('./models/Player');
const players = require('./players');

mongoose.connect('mongodb://localhost:27017/ratings');

players.forEach(player => {
    const newPlayer = new Player(player);
    newPlayer.save();  
});

mongoose.disconnect();


