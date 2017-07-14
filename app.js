const express = require('express');
const mongoose = require('mongoose');
const Player = require('./models/Player');
const path = require('path');
const mapping = require('./mapping');

mongoose.connect('mongodb://localhost:27017/ratings-nested');
const app = express();

mongoose.Promise = global.Promise;

app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

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

  const sum = dob.reduce((a, b) => a + b);
  const avg = sum / dob.length;
  return [mapping[fed._id], +(avg / 31536000000).toFixed(2)];
}

const port = 3000;

app.get('/ratingGain', async (req, res) => {
  // const ratingGainList = await Player.aggregate([
  //   { $unwind: '$ratings' },
  //   { $group: { _id: '$_id', first: { $first: '$ratings' }, last: { $last: '$ratings' }, lastName: { $first: '$lastName' } } },
  //   { $project: { lastName: 1, last: 1, first: 1, ratingGain: { $subtract: ['$first.ukrRating', '$last.ukrRating'] } } },
  //   { $sort: { ratingGain: -1 } },
  // ]).exec();
  Player.find({ firstName: 'Богдан' }).exec((err, players) => {
    // res.render('rating-gain', { players: ratingGainList });
    res.render('rating-gain', { players });
  });
  // const ratingGainList = [1, 2, 3];
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
