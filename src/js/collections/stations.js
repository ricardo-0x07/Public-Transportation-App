 /* global module, require */
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");
var Station = require('../models/station');

var Stations = Backbone.Collection.extend({
  url: '/Stations',
  localStorage: new Backbone.LocalStorage('Stations'),
  model: Station
});

module.exports = Stations;
