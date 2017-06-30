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
        { $match: {title: /кмс/} },
        { $group: {_id: '$fed', total: {$sum : 1}} }
    ]);
    query.exec((err, players) => {
        if (err) res.send(err);
        else {
            res.send(players.map(p => [ mapping[p._id], p.total ]));
        }
    });
});

app.get('/average', function(req, res) {
    let query = Player.aggregate([
        { $group: {_id : '$fed', rating: {$avg: '$gamesPlayed'}} }
    ]);
    query.exec((err, players) => {
        if (err) res.send(err);
        else {
            res.send(players.map(p => [ mapping[p._id], p.rating ]));
        }
    });
});

app.get('/average-age', function(req, res) {
    let query = Player.aggregate([
        // { $project : {_id : 0, fed: 1, dob: 1}}
        { $group: {_id : '$fed', players: {$push: '$dob'}}}
    ]);

    query.exec((err, players) => {
        if (err) res.send(err);
        else {
            // res.send(players.map(p => [ mapping[p._id], p.rating ]));
            res.send(players.map(findAverage));
        }
    });
});

function findAverage(fed) {

    const dob = fed.players.map(strDate => {
        if (strDate) {
            let date = new Date(strDate);
            return Date.now() - date;
        } else {
            return 0;
        }
    });
    var sum = dob.reduce(function(a, b) { return a + b; });
    var avg = sum / dob.length;
    return [mapping[fed._id], avg / 31536000000]
}

const port = 3000;

app.listen(port, function() {
    console.log(`server is listening on port ${port}`)
});