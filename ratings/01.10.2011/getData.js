const fs = require('fs');
const request = require('request');
const iconv = require('iconv-lite');
const urls = require('./urls');

urls.forEach((url) => {
  request(url)
        .pipe(iconv.decodeStream('win1251'))
        .pipe(fs.createWriteStream(url.slice(35)));
});
