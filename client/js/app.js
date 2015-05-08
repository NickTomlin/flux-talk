'use strict';

var angular = require('angular');
var assign = require('object-assign');
var uuid = require('uuid').v1;
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Flux').Dispatcher;

var tilApp = angular.module('til', []);
var dispatcher = new Dispatcher();

tilApp.directive('addTil', require('./components/add-til'));
tilApp.directive('tilList', require('./components/til-list'));

tilApp.controller('index', function ($scope, tilStore) {
  $scope.tils = [];

  tilStore.addChangeListener(function () {
    $scope.tils = tilStore.getAll();
  });
});

tilApp.service('clientActionCreators', function () {
  this.addTil = function (data) {
    console.log('clientActionCreatorsCreators::AddTil', data);
    dispatcher.dispatch({
      type: 'ADD_TIL',
      data: {
        til: {
          text: data.text
        }
      }
    });
  };
});

tilApp.service('tilStore', function () {
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

  dispatcher.register(function (payload) {
    switch (payload.type) {
      case 'ADD_TIL':
        console.log('tilStore::ADD_TIL', payload.data);
        var til = payload.data.til;
        til.clientId = uuid();
        _tils[til.clientId] = til;
        tilStore.emit('change');
      break;

      default:
        // ¯\_(ツ)_/¯
    }
  });

  return tilStore;
});
