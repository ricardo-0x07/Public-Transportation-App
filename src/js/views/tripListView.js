'use strict';
/* global require, module */
var $ = require('jquery');
var Handlebars = require('handlebars');
var Backbone = require('backbone');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  tagName: 'div',

  className: 'trip_list_view layout vertical',

  initialize: function() {
  },

  template: Handlebars.compile($('#tpl_trip_list').html()),

  render: function() {
    $(this.el).html(this.template({stations: this.model.toJSON()}));
    return this.el;
  }
});
