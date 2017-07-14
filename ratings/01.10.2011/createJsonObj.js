const fs = require('fs');
const path = require('path');

const columnNames = [
  'lastName',
  'firstName',
  'title',
  'gamesPlayed',
  'ratingChange',
  'ukrRating',
  'dob',
  'fed',
  'IDF',
  'expireDate',
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
    if (currentYear < +(`20${year}`)) {
      year = `19${year}`;
      console.log(year);
    }
  }

  return new Date(`${month}.${day}.${year}`);
}

// const FIDE_RATING_BEGINNING = 48;

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

fs.readdir('./cleaned', (err, files) => {
  if (err) { console.log('Err'); console.log(err); } else {
    console.log(files);
    files.forEach((file) => {
      console.log('File to read');
      console.log(path.join(__dirname, 'cleaned', file));
            // fs.readFile(path.join(__dirname, 'ratings', file), (err, data) => {
    //   const data = require(`./cleaned/${file}`);
      const data = fs.readFileSync(`./cleaned/${file}`);
      if (err) { console.log(err); }
      const rows = (`${data}`).replace(/(.{82})/g, '$1|').split('|');

            // add zero instead of empty fide rating (for easier parsing)
        // const addZero = rows.map((row) => {
        //       if (row[FIDE_RATING_BEGINNING] === ' ') {
        //           return replace(row, FIDE_RATING_BEGINNING, '0');
        //         }
        //           return row;

        //     });

      const mapped = rows.map(row => row.split(/\s+/)).map((row) => {
        if (!row[0]) { // remove players without lastName
          row.shift();
        }
        // console.log(row);
                // row.splice(8, 1); // remove federation column
        // row.pop(); // remove Примітка column
        return row.slice(0, 10);
      }).filter(row => row.length === 10).map((row) => {
        row[6] = transformDate(row[6], true);
        row[9] = transformDate(row[9]);
        return row;
      })
      .map((row) => {
        const player = {};
        columnNames.forEach((column, i) => {
          player[column] = row[i];
        });
        return player;
      });
      fs.writeFile(`./forMongo/${path.parse(file).name}.js`, `module.exports = ${JSON.stringify(mapped, null, 2)}`, (err, result) => {
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
