const fs = require('fs');
const os = require('os');
const path = require('path');

fs.readdir('./data', (err, files) => {
    console.log(files)
    files.forEach(file => {
        fs.readFile(path.join(__dirname, 'data', file), 'utf8', (err, data) => {
            // console.log(data.split(os.EOL))
            fs.writeFile(file, data.split(os.EOL).slice(5).join(os.EOL));
        });
    });
});