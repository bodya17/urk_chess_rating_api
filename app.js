const express = require('express');
const mongoose = require('mongoose');
const Player = require('./models/Player');

mongoose.connect('mongodb://localhost:27017/ratings');
const app = express();

app.get('/fed', function(req, res) {
    let query = Player.collection.distinct('fed', function(err, result) {
        if (err) res.send(err);
        else res.send(result);
    });
});

const port = 3000;
app.listen(port, function() {
    console.log(`server is listening on port ${port}`)
});