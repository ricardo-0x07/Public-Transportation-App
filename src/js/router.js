'use strict';

/* jslint browser:true*/
/* eslint-disable no-unused-vars*/
/* global window, $, google, document, ko, Backbone, Handlebars, navigator, require, module, fetch, console */
/* eslint no-negated-condition: 2*/

var _ = require('underscore');
var Handlebars = require('handlebars');
var options = [];
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var TripListView = require('./views/tripListView');
var ShellView = require('./views/shellView');
var Trip = require('./models/trip');
var Trips = require('./collections/trips');
var Station = require('./models/station');
var Stations = require('./collections/stations');
var NavView = require('./views/navigationView');
var parseString = require('xml2js').parseString;
var TripSummaryView = require('./views/tripSummaryView');
var indexController = require('./controllers/IndexController');
var bartArriveRequest = 'http://api.bart.gov/api/sched.aspx?cmd=arrive&orig=ASHB&dest=CIVC&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1';
var stationInfo = 'http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V';
var bartDepartRequest = 'http://api.bart.gov/api/sched.aspx?cmd=depart&orig=ASHB&dest=CIVC&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1';
var departureStn = '';
var arrivalStn = '';
var bartDepartRequestDynamic = 'http://api.bart.gov/api/sched.aspx?cmd=depart&orig=' + departureStn + '&dest=' + arrivalStn + '&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1';
var urlUse = '';
var Router = Backbone.Router.extend({
  initialize: function() {
    $('.navBar').html(new NavView().render());
  },
  routes: {
    '': 'tripList'
  },
  tripList: function(url) {
    var _this = this;
    window.fetch(stationInfo)
    .then(this.text)
    .then(this.stationInfoxmlTojs)
    .then(this.stationInfoFormatJson)
    .catch(function(error) {
      console.log('Request failed', error);
    })
    .then(this.displayList)
    .then(function() {
      _this.setUrl();
      return _this.loadTrips(bartDepartRequest);
    });
  },
  showView: function(selector, view) {
    if (this.currentView) {
      this.currentView.close();
    }

    $(selector).html(view.render());
    this.currentView = view;

    return view;
  },
  loadTrips: function(url) {
    var _this = this;
    console.log(url);
    urlUse = ((url === '') ? bartDepartRequest : url);
    return _this.fetchTrips(urlUse)
    .then(this.displaySummary);
  },
  fetchTrips: function(url) {
    return window.fetch(url)
    .then(this.text)
    .then(this.xmlTojs)
    .then(this.formatJson)
    .catch(function(error) {
      console.log('Request failed', error);
    });
  },
  status: function(response) {
    console.log('response', response);
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
  },
  text: function(response) {
    console.log('response', response);
    return response.text();
  },
  xmlTojs: function(data) {
    var trips;
    parseString(data, function(err, result) {
      trips = result.root.schedule[0].request[0].trip;
    });
    console.log('trips', trips);
    return {url: data.url, data: trips};
  },
  stationInfoxmlTojs: function(data) {
    // console.log('data', data);
    var stations;
    parseString(data, function(err, result) {
      stations = result.root.stations[0].station;
      console.log('result', result);
    });
    console.log('stations', stations);
    return stations;
  },
  formatJson: function(response) {
    console.log('response', response);
    var formattedResponse = response.data.map(function(trip) {
      var newleg = trip.leg.map(function(leg) {
        console.log('leg', leg);
        leg = leg.$;
        console.log('leg', leg);
        return leg;
      });
      return newleg;
    });
    return formattedResponse;
  },
  stationInfoFormatJson: function(response) {
    var formattedResponse = response.map(function(station) {
      var newStation = {};
      newStation.abbr = station.abbr[0];
      newStation.address = station.address[0];
      newStation.city = station.city[0];
      newStation.county = station.county[0];
      newStation.gtfsLatitude = station.gtfs_latitude[0];
      newStation.gtfsLongitude = station.gtfs_longitude[0];
      newStation.name = station.name[0];
      newStation.state = station.state[0];
      newStation.zipcode = station.zipcode[0];

      return newStation;
    });
    console.log('formattedResponse', formattedResponse);
    return formattedResponse;
  },
  displaySummary: function(response) {
    var trips = new Trips(response);
    var tripSummaryView = new TripSummaryView({model: trips});
    tripSummaryView.render();
  },
  displayList: function(response) {
    var stations = new Stations(response);
    var tripListView = new TripListView({model: stations});
    $('.shell').html(new ShellView().render());
    $('.content').html(tripListView.render());

    return stations;
  },
  setUrl: function() {
    var _this = this;
    var orig = '12TH';
    var dest = '12TH';
    $("#departureStn").change(function() {
      var element = $(this).find('option:selected');
      orig = element.attr("value");
      console.log('orig', orig);
      var bartDepartRequestDynamicx = 'http://api.bart.gov/api/sched.aspx?cmd=depart&orig=' + orig + '&dest=' + dest + '&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1';
      _this.loadTrips(bartDepartRequestDynamicx);
      console.log('bartDepartRequestDynamicx', bartDepartRequestDynamicx);
    });
    $("#arrivalStn").change(function() {
      var element = $(this).find('option:selected');
      dest = element.attr("value");
      console.log('dest', dest);
      var bartDepartRequestDynamicx = 'http://api.bart.gov/api/sched.aspx?cmd=depart&orig=' + orig + '&dest=' + dest + '&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1';
      _this.loadTrips(bartDepartRequestDynamicx);
      console.log('bartDepartRequestDynamicx', bartDepartRequestDynamicx);
    });
    return;
  }
});
var _instance;
var SingletonRouter = function() {
  if (_instance === undefined) {
    _instance = new Router();
  }
  return _instance;
};

module.exports = new SingletonRouter();

