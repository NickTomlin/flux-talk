'use strict';

module.exports = function () {
  return {
    scope: {
      'tils': '=tils'
    },
    controller: function ($scope, clientActionCreators) {
      $scope.addComment = function ($event, til) {
        if ($event.which === 13) {
          clientActionCreators.addComment({
            text: $event.target.value,
            tilClientId: til.clientId,
            userId: 'user-id' // hardcoded for simplicity
          });
          $event.target.value = '';
        }
      };
    },
    templateUrl: '/templates/components/til-list/til-list.html'
  };
};
