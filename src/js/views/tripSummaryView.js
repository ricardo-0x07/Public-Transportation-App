'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;
var helper = require("handlebars-helpers")();

module.exports = Backbone.View.extend({
  el: '.trip_list',

  tagName: 'a',

  className: 'trip_summary list-group-item entry',

  initialize: function() {
    Handlebars.registerHelper('add', helper.add);
  },

  template: Handlebars.compile($('#tpl_trip').html()),

  render: function() {
    $('.trip_list').html(this.template({trip: this.model.toJSON()}));

    return this.el;
  }
});
