'use strict';

var angular = require('angular');
var assign = require('object-assign');
var uuid = require('uuid').v1;
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Flux').Dispatcher;

var tilApp = angular.module('til', []);
var dispatcher = new Dispatcher();

tilApp.controller('index', function ($scope, tilClientActions) {
  $scope.tils = [{text: 'This is dynamic'}];
  $scope.tilInput = '';
  $scope.addTil = function () {
    console.log('tilController::AddTil', $scope.tilInput);
    tilClientActions.addTil($scope.tilInput);
  }
});

tilApp.service('tilClientActions', function () {
  this.addTil = function (text) {
    console.log('tilClientActions', text);
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
