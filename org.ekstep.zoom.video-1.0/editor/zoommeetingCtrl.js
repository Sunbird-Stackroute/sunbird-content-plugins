/**
 * Plugin to add questions in question set
 * @class Zoom Meeting
 * Jagadish Pujari <jagadish.pujari@niit.com>
 */
'use strict';
angular.module('ZoomMeetingApp', [])
  .controller('ZoomMeetingController', ['$http', '$scope', 'pluginInstance', function ($http, $scope) {
    $scope.method = 'POST';
    $scope.url = 'http://localhost:5000/createmeeting';
    $scope.fetch = function () {
      $scope.response = null;
      $scope.title = $scope.topic;
      $http({ method: $scope.method, url: $scope.url }).
        then(function (response) {
          $scope.data = response.data;
          $scope.newMeetingDetails = Object.assign($scope.data, { zoomtopic: $scope.topic }
            , { zoomStartDate: $scope.startDate },
            { zoomEndDate: $scope.endDate }
          )
          ecEditor.dispatchEvent('org.ekstep.zoom.video:addMeeting', $scope.newMeetingDetails);
          $scope.closeThisDialog();
        }, function (response) {
          $scope.data = response.data || 'Request failed';
        });
    };

    $scope.createMeeting = function () {
      ecEditor.dispatchEvent('org.ekstep.zoom.video:addMeeting', $scope.newMeetingDetails);
      $scope.closeThisDialog();
    }
  }]);

//# sourceURL=ZoomMeetingController.js
