'use strict';

module.exports = function (clientActionCreators) {
  return {
    scope: {},
    template: '<input ng-keyup="addTil($event)" class="form-control">',
    link: function ($scope) {
      $scope.addTil = function ($event) {
        if ($event.which === 13) {
          clientActionCreators.addTil({
            text: $event.currentTarget.value,
            userId: 'user-id' // hardcoded for simplicity
          });
          $event.currentTarget.value = '';
        }
      };
    }
  };
};
