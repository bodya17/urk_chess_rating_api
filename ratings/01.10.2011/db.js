const Player = require('../../models/Player');
const mongoose = require('mongoose');
const express = require('express');

const app = express();

mongoose.connect('mongodb://localhost:27017/ratings_nested');


app.get('/', (req, res) => {
     const ratingGainList = Player.aggregate([
        { $unwind: '$ratings' },
        { $group: { _id: '$_id', first: { $first: '$ratings' }, last: { $last: '$ratings' }, lastName: { $first: '$lastName' } } },
        { $project: { lastName: 1, last: 1, first: 1, ratingGain: { $subtract: ['$first.ukrRating', '$last.ukrRating'] } } },
        { $sort: { ratingGain: -1 } },
        { $limit: 5 }
    ]).exec((err, result) => {
        console.log(result);
        res.send(result);
    });
});
// (async function() {
//     const playerFromDB = await Player.findOne({
//         lastName: 'Левантович'
//     }).exec();
//     console.log(playerFromDB);
// })()


app.listen(3000);
console.log('Server listening on port 3000')