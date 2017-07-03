const fs = require('fs');
const path = require('path');
// const data = require('./ratings/Ivano-Frankivsk');
// const data = require('./ratings/Kyiw');

const columnNames = [
    'lastName',
    'firstName',
    'title',
    'gamesPlayed',
    'ratingChange',
    'ukrRating',
    'fideRating',
    'dob',
    'fed',
    'IDF',
    'expireDate'
];


// replace('car', 0, 'b') => 'bar'
function replace(str, index, paste) {
	return str.slice(0, index) + paste + str.slice(index + 1);
}

// transformDate('25.05.11') => new Date('05.25.11')
// transformDate('25.05.11', true) => new Date('05.25.1911')
function transformDate(date, moveBack) {
    let [day, month, year] = date.split('.');
    if (moveBack) {
        const currentYear = new Date().getFullYear();
        if (currentYear < +('20' + year)) {
            year = '19' + year;
            console.log(year)
        }
    }
    
    return new Date(`${month}.${day}.${year}`);
}

const FIDE_RATING_BEGINNING = 48;

// fs.readdir('./ratings', (err, files) => {
//     if (err) { console.log('Err'); console.log(err); }
//     else {
//         files.forEach(file => {
//             var pathToFile = path.join(__dirname, 'ratings', file);
//             fs.readFile(pathToFile, (err, data) => {
//                 if (err) { console.log('err') }
//                 else { console.log(''+data) }
//             })
//         })
//      }
// })

fs.readdir('./ratings', (err, files) => {
    if (err) { console.log('Err'); console.log(err); }
    else {
        console.log(files);
        files.forEach(file => {
            console.log('File to read');
            console.log(path.join(__dirname, 'ratings', file));
            // fs.readFile(path.join(__dirname, 'ratings', file), (err, data) => {
            const data = require(`./ratings/${file}`)
            if (err) { console.log(err); }
            const rows = (''+data).replace(/(.{85})/g, '$1|').split('|');

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
                // row.splice(8, 1); // remove federation column
                row.pop();
                return row;
            }).filter(row => row.length === 11).map(row => {
                row[7] = transformDate(row[7], true);
                row[10] = transformDate(row[10]);
                return row;
            }).map(row => {
                const player = {};
                columnNames.forEach((column, i) => {
                    player[column] = row[i];
                });
                return player;
            });
            fs.writeFile(`./forMongo/${file}`, 'module.exports = ' + JSON.stringify(mapped, null, 2), (err, result) => {
                if (err) {
                    console.log('Error');
                    console.log(err);
                } else {
                    console.log('Everything is ok!');
                }
            });
            // });
        });
    }
});

// console.log(addZero)
