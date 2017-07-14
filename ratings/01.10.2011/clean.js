const fs = require('fs');
const os = require('os');
const path = require('path');

fs.readdir('./data', (readDirErr, files) => {
  files.forEach((file) => {
    fs.readFile(path.join(__dirname, 'data', file), 'utf8', (err, data) => {
      // console.log(data.split(os.EOL))
      let arrayOfRows = data.split(os.EOL);
      const footerIndex = arrayOfRows.findIndex(el => el.includes('Список турниров от'));
      arrayOfRows = arrayOfRows.slice(0, footerIndex - 1);
      fs.writeFile(path.join('cleaned', file), arrayOfRows.slice(5).map(r => r.slice(5)).join(os.EOL));
    });
  });
});
