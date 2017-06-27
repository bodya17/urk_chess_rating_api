const fs = require('fs');
const data = require('./lvivRatings');

const columnNames = [
    'lastName',
    'firstName',
    'title',
    'gamesPlayed',
    'ratingChange',
    'ukrRating',
    'fideRating',
    'dob',
    'IDF',
    'expireDate'
];

function replace(str, index, paste) {
	return str.slice(0, index) + paste + str.slice(index + 1);
}

const FIDE_RATING_BEGINNING = 48;

const rows = data.replace(/(.{85})/g, '$1|').split('|');

// add zero instead of empty fide rating (for easier parsing)
const addZero = rows.map(row => {
    if (row[FIDE_RATING_BEGINNING] === ' ') {
        return replace(row, FIDE_RATING_BEGINNING, '0');
    } else {
        return row;
    }
});

const mapped = addZero.map(row => row.split(/\s+/)).map(row => {
    if (!row[0]) {
        row.shift();
    }
    row.splice(8, 1); // remove federation column
    row.pop();
    return row;
});
// console.log(addZero)
fs.writeFile('players.json', JSON.stringify(mapped, null, 2), (err, result) => {
    if (err) {
        console.log('Error');
        console.log(err);
    } else {
        console.log('Everything is ok!');
    }
});