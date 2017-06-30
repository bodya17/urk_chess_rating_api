const express = require('express');
const mongoose = require('mongoose');
const Player = require('./models/Player');
const path = require('path');
const mapping = require('./mapping');

mongoose.connect('mongodb://localhost:27017/ratings');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/fed', function(req, res) {
    let query = Player.collection.distinct('fed', function(err, result) {
        if (err) res.send(err);
        else res.send(result);
    });
});

app.get('/national-masters', function(req, res) {
    let query = Player.aggregate([
        {$match: {title: /1/}},
        {$group: {_id: '$fed', total: {$sum : 1}}}
    ]);
    query.exec((err, players) => {
        if (err) res.send(err);
        else {
            res.send(players.map(p => [ mapping[p._id], p.total ]));
        }
    });
});

const port = 3000;

app.listen(port, function() {
    console.log(`server is listening on port ${port}`)
});