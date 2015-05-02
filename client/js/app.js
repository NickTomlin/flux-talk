'use strict';

var angular = require('angular');
var assign = require('object-assign');
var uuid = require('uuid').v1;
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Flux').Dispatcher;

var tilApp = angular.module('til', []);
var dispatcher = new Dispatcher();

tilApp.controller('index', function ($scope, clientActionCreators, tilStore) {
  $scope.tils = [];
  $scope.tilInput = '';

  tilStore.addChangeListener(function () {
    $scope.tils = tilStore.getAll();
  });

  $scope.addTil = function () {
    console.log('controller::AddTil', $scope.tilInput);
    clientActionCreators.addTil($scope.tilInput);
    $scope.tilInput = '';
  };
});

tilApp.service('clientActionCreators', function () {
  this.addTil = function (text) {
    console.log('clientActionCreators::AddTil', text);
    dispatcher.dispatch({
      type: 'ADD_TIL',
      data: {
        til: {
          text: text,
          clientId: uuid()
        }
      }
    });
  }
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
        _tils[payload.data.til.clientId] = payload.data.til;
        tilStore.emit('change');
      break;

      default:
        // ¯\_(ツ)_/¯
    }
  });

  return tilStore;
});
