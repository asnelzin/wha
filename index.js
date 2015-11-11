const wallpaper = require('wallpaper');
const got = require('got');
const xmldom = require('xmldom');
const xpath = require('xpath');
const uri = require('url');
const fs = require('fs');

const downloadUrl = 'http://workhardanywhere.com/download/';

var domParser = new xmldom.DOMParser({
    errorHandler: {}
});

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)]
}


const tmpFile = './tmp.jpg';
var fileStream = fs.createWriteStream(tmpFile);


got(downloadUrl)
    .then(function(response) {
        var page = domParser.parseFromString(response.body);
        var articles = xpath.select('.//article/div/a/@href', page);

        got(getRandomElement(articles).value)
            .then(function(response) {
                page = domParser.parseFromString(response.body);
                var imgLink = xpath.select("//a[text()='Laptop Wallpaper']/@href", page)[0];
                var imgLinkParsed = uri.parse(imgLink.value);
                imgLink = imgLinkParsed.host + imgLinkParsed.pathname + '?raw=1';
                got.stream(imgLink).pipe(fileStream)
                    .then(function() {
                        wallpaper.set(tmpFile);
                    });
            });
    });
