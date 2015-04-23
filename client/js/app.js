'use strict';

var angular = require('angular');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Flux').Dispatcher;

var dispatcher = new Dispatcher();
var app = angular.module('til', []);

app.controller('index', function ($scope, tilStore, ClientActions) {
  $scope.tilInput = '';
  $scope.tils = [];

  tilStore.addChangeListener(function () {
    console.log('Controller::Change')
    $scope.tils = $scope.tils.concat(tilStore.getAll());
  });

  $scope.addTil = function () {
    console.log('View::addTil');
    ClientActions.addTil($scope.tilInput);
    $scope.tilInput = '';
  };
});

app.service('tilStore', function () {
  var _counter = 0;
  var _tils = {};

  var tilStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
      this.on('change', callback);
    },
    getAll: function () {
      return Object.keys(_tils).map(function (key) {
        return _tils[key];
      });
    }
  });

  tilStore.dispatchToken = dispatcher.register(function (payload) {
    switch (payload.type) {
      case 'ADD_TIL':
        console.log('Store::handler');
        _tils[_counter] = {
          text: payload.text,
          id: _counter
        };
        tilStore.emit('change');
      break;
      default:
         // ¯\_(ツ)_/¯
    }
  });

  return tilStore;
});

app.service('ClientActions', function () {
  this.addTil = function (text) {
    console.log('ClientActions::addTil');
    dispatcher.dispatch({
      type: 'ADD_TIL',
      text: text
    });
  };
});
