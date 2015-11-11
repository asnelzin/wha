'use strict';
const fs = require('fs');
const got = require('got');
const wallpaper = require('wallpaper');
const xmldom = require('xmldom');
const xpath = require('xpath');
const uri = require('url');

const downloadUrl = 'http://workhardanywhere.com/download/';
const tmpFile = './tmp.jpg';

var domParser = new xmldom.DOMParser({
	errorHandler: {}
});


function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}


function handleError(error) {
	console.log(error.response.body);
}


exports.setRandomWallpaper = function () {
	got(downloadUrl)
		.then(function (response) {
			var page = domParser.parseFromString(response.body);
			var articles = xpath.select('.//article/div/a/@href', page);

			got(getRandomElement(articles).value)
				.then(function (response) {
					page = domParser.parseFromString(response.body);
					var imgLink = xpath.select("//a[text()='Laptop Wallpaper']/@href", page);
					var imgLinkParsed = uri.parse(imgLink[0].value);
					imgLink = imgLinkParsed.host + imgLinkParsed.pathname + '?raw=1';
					got.stream(imgLink).pipe(fs.createWriteStream(tmpFile));
				})
				.catch(handleError);
		})
		.catch(handleError);

	wallpaper
		.set(tmpFile)
		.catch(console.log);
};
