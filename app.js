const express = require('express');
const mongoose = require('mongoose');
const Player = require('./models/Player');
const path = require('path');
const mapping = require('./mapping');

mongoose.connect('mongodb://localhost:27017/ratings');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/fed', (req, res) => {
  const query = Player.collection.distinct('fed', (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.get('/ratings/:title', (req, res) => {
  const query = Player.aggregate([
        { $match: { title: new RegExp(req.params.title) } },
        { $group: { _id: '$fed', total: { $sum: 1 } } },
  ]);
  query.exec((err, players) => {
    if (err) res.send(err);
    else {
        res.send(players.map(p => [mapping[p._id], p.total]));
      }
  });
});

app.get('/sort', (req, res) => {
    // res.send('sort');
  const query = Player.aggregate([
    { $sort: { ukrRating: -1 } },
    { $project: { ukrRating: 1, _id: 0, lastName: 1 } },
    { $limit: 3000 },
  ]);
  query.exec((err, players) => {
    if (err) res.send(err);
    else res.send(players);
  });
});

app.get('/age', (req, res) => {
  const query = Player.aggregate([
    { $match: { dob: { $gt: new Date('01 Jan 1970') } } },
    { $project: { year: { $year: '$dob' } } },
    { $group: { _id: '$year', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);
  query.exec((err, players) => {
    if (err) res.send(err);
    else {
      res.send(players);
    }
  });
});

app.get('/age-average-rating', (req, res) => {
  const query = Player.aggregate([
        { $match: { dob: { $gt: new Date('01 Jan 1970') } } },
        { $project: { year: { $year: '$dob' }, ukrRating: 1 } },
        { $group: { _id: '$year', rating: { $avg: '$ukrRating' } } },
        { $sort: { _id: -1 } },
  ]);
  query.exec((err, players) => {
    if (err) res.send(err);
    else {
      res.send(players);
    }
  });
});

app.get('/average-rating-by-fed', (req, res) => {
  const query = Player.aggregate([
        { $group: { _id: '$fed', rating: { $avg: '$ukrRating' } } },
        { $sort: { rating: -1 } },
  ]);
  query.exec((err, players) => {
    if (err) res.send(err);
    else {
      const minRating = Math.min(...players.map(p => p.rating));
      console.log('min rating : ', minRating);
      res.send(players.map(p => [mapping[p._id], p.rating - minRating]));
    }
  });
});

app.get('/average', (req, res) => {
  const query = Player.aggregate([
        { $group: { _id: '$fed', rating: { $avg: '$gamesPlayed' } } },
  ]);
  query.exec((err, players) => {
    if (err) res.send(err);
    else {
      res.send(players.map(p => [mapping[p._id], p.rating]));
    }
  });
});

app.get('/average-age', (req, res) => {
  const query = Player.aggregate([
        // { $project : {_id : 0, fed: 1, dob: 1}}
        { $group: { _id: '$fed', players: { $push: '$dob' } } },
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
  const dob = fed.players.map((strDate) => {
    if (strDate) {
      const date = new Date(strDate);
      return Date.now() - date;
    }
    return 0;
  });

  const sum = dob.reduce((a, b) => { return a + b; });
  const avg = sum / dob.length;
  return [mapping[fed._id], +(avg / 31536000000).toFixed(2)];
}

const port = 3000;

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
