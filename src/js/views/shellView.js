'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  tagName: 'section',

  className: 'row shell-view main',

  initialize: function() {

  },

  template: Handlebars.compile($('#tpl_shell').html()),

  render: function() {
    $(this.el).html(this.template());
    return this.el;
  }
});
