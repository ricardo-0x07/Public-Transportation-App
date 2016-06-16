 /* global module, require */
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
Backbone.LocalStorage = require("backbone.localstorage");
var Trip = require('../models/trip');

var Trips = Backbone.Collection.extend({
  url: '/Trips',
  localStorage: new Backbone.LocalStorage('Trips'),
  model: Trip
});

module.exports = Trips;
