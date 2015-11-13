'use strict';
const fs = require('fs');
const got = require('got');
const wallpaper = require('wallpaper');
const xmldom = require('xmldom');
const xpath = require('xpath');
const uri = require('url');

const downloadUrl = 'http://workhardanywhere.com/download/';
const tmpFile = './tmp.jpg';

const domParser = new xmldom.DOMParser({
	errorHandler: {}
});

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

exports.setRandomWallpaper = function () {
	got(downloadUrl)
		.then(response => {
			let page = domParser.parseFromString(response.body);
			const articles = xpath.select('.//article/div/a/@href', page);

			got(getRandomElement(articles).value)
				.then(response => {
					page = domParser.parseFromString(response.body);
					let imgLink = xpath.select('//a[text()="Laptop Wallpaper"]/@href', page);
					const imgLinkParsed = uri.parse(imgLink[0].value);
					imgLink = `${imgLinkParsed.host + imgLinkParsed.pathname}?raw=1`;

					const stream = got.stream(imgLink).pipe(fs.createWriteStream(tmpFile));
					stream.on('finish', () => {
						wallpaper.set(tmpFile)
							.catch(console.log);
					});
				})
				.catch(console.log);
		})
		.catch(console.log);
};
