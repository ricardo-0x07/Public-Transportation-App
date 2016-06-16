'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
global.jQuery = require('jquery');
require("bootstrap");

module.exports = Backbone.View.extend({
	// tagName: nav,

	// className: 'navBar',

  initialize: function() {
  },

  template: Handlebars.compile($('#tpl_nav').html()),

  render: function() {
    $(this.el).html(this.template());

    return this.el;
  }

});

