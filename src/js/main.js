'use strict';
/* jslint browser:true*/
/* eslint-disable no-unused-vars*/
/* global window, $, google, document, ko, Backbone, Handlebars, navigator, require */
/* eslint no-negated-condition: 2*/
require('./controllers/IndexController.js');
var _ = require('underscore');
var Handlebars = require('handlebars');
var options = [];
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var router = require('./router');

Backbone.View.prototype.close = function() {
  console.log('Closing view ' + this);

  if (this.beforeClose) {
    this.beforeClose();
  }

  this.remove();
  this.unbind();
  this.off();
};

$('body').on('click', '.back-button', function(event) {
  event.preventDefault();
  window.history.back();
});
Backbone.history.start();

