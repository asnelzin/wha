#!/usr/bin/env node
'use strict';
const meow = require('meow');
const wha = require('./index');

meow(`
	Changing your wallpaper for random from workhardanywhere.com

	Usage
	  $ wha
`, {});

wha.setRandomWallpaper();
