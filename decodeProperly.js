const request = require('request');
const fs = require('fs');
const iconv = require('iconv-lite');

request('http://ukrchess.org.ua/kvalif/1210/LUG.txt')
    .pipe(iconv.decodeStream('win1251'))
    .pipe(fs.createWriteStream('lvo.txt'))
