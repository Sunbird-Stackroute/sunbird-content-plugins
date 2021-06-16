/**
 * Plugin to add questions in question set
 * @class Zoom Meeting
 * Jagadish Pujari <jagadish.pujari@niit.com>
 */
'use strict';
angular.module('ZoomMeetingApp', [])
  .controller('ZoomMeetingController', ['$http', '$scope', 'pluginInstance', function ($http, $scope) {
    $scope.method = 'POST';
    $scope.url = 'https://sunbird.stackroutelabs.com/api/meeting/v1/create';
    $scope.fetch = function () {
      $scope.response = null;
      $scope.title = $scope.topic;
      $scope.type = 1;

      const startdate = $scope.startDate,
        enddate = $scope.endDate;
 
      // api response
      $scope.data = {
        "request": {
          topic: $scope.topic,
          "type": $scope.type,
          "start_time": moment($scope.startDate.toISOString()).format(`YYYY-MM-DD HH:mm`),
          "end_time": moment($scope.endDate.toISOString()).format(`YYYY-MM-DD HH:mm`),
          "duration": moment(enddate).diff(moment(startdate), `hours`),
          "timezone": moment.tz.guess(),
          "created_by": "3d744b7d-3840-4543-b399-dc5c90b1871a",
          "content_id": "",
          "agenda": $scope.topic,
          "settings": {
            "host_video": "false",
            "participant_video": "false"
          }
        }
      };
      $http({ method: $scope.method, url: $scope.url, data: $scope.data }).then(function (response) {
        $scope.data = response.data;
        $scope.newMeetingDetails = Object.assign(
          $scope.data,
          { zoomtopic: $scope.topic },
          { zoomStartDate: $scope.startDate },
          { zoomEndDate: $scope.endDate }
        );

        const currentDate = moment(new Date().toISOString()).format(`YYYY-MM-DD HH:mm`),
          startDate = moment($scope.newMeetingDetails.zoomStartDate.toISOString()).format(`YYYY-MM-DD HH:mm`),
          endDate = moment($scope.newMeetingDetails.zoomEndDate.toISOString()).format(`YYYY-MM-DD HH:mm`),
          topicName = (/^[+-]?\d+(\.\d+)?$/).test($scope.newMeetingDetails.zoomtopic);

        if (topicName) {
          document.getElementById(`TopicNameCheck`).style.display = `block`;
          setTimeout(() => {
            document.getElementById(`TopicNameCheck`).style.display = `none`;
          }, 4000);
        } else if ((moment(startDate).isSameOrBefore(endDate) &&
          moment(startDate).isSameOrAfter(currentDate) &&
          moment(endDate).isSameOrAfter(currentDate)) ||
          (moment(endDate).isSameOrAfter(startDate) &&
            moment(startDate).isSameOrAfter(currentDate) &&
            moment(endDate).isSameOrAfter(currentDate))) {
          ecEditor.dispatchEvent('org.ekstep.zoom.video:addMeeting', $scope.newMeetingDetails);
          $scope.closeThisDialog();
        } else {
          document.getElementById('InvalidStartDateTemplate').style.display = 'block';
          setTimeout(() => {
            document.getElementById('InvalidStartDateTemplate').style.display = 'none';
          }, 2000);
        }
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
