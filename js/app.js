var app = angular.module('myApp', []);

app.controller('timerController', ['$scope', '$interval', 'timerService', function ($scope, $interval, timerService) {
    'use strict';
    var timeStatus = 0;
    $scope.timerIsRunning = false;
    $scope.startTime = 0;
    $scope.lapTime = 0;
    $scope.laps = [];

    $scope.timeStatus = {
        minutes: '00',
        seconds: '00',
        ms: '00'
    };

    var lapTimer = function () {
        $scope.lapTime = timerService.split(timeStatus - $scope.startTime);
        $scope.startTime = timeStatus;
    };

    // starts the timer
    $scope.startTimer = function () {
        $scope.timerIsRunning = true;
        $scope.startTime = timeStatus;

        // clear the interval
        if ($scope.timeRun) {
            $interval.cancel($scope.timeRun);
        }

        // updates the timer
        $scope.timeUpdate = function () {
            timeStatus += 1;
            // use service to split the timer into minutes, seconds an milliseconds
            // the service returns an object.
            $scope.timeStatus = timerService.split(timeStatus);
        };
        // set the interval
        $scope.timeRun = $interval($scope.timeUpdate, 10);
    };

    // stopes the timer
    $scope.stopTimer = function () {
        $scope.timerIsRunning = false;
        if ($scope.timeRun) {
            $interval.cancel($scope.timeRun);
            // save the lap time for future use (if the user hits the lap button after the stop)
            lapTimer();
            $scope.startTime = timeStatus;
        }
    };

    // resets the timer
    $scope.resetTimer = function () {
        timeStatus = 0;
        // clears the laps array
        $scope.laps = [];
        $interval.cancel($scope.timeRun);
        // resets the view
        $scope.timeStatus.minutes = '00';
        $scope.timeStatus.seconds = '00';
        $scope.timeStatus.ms = '00';
        $scope.stopTimer();
        // clears the local storage
    };

    // add the lap time to the lap array and the local storage
    $scope.lapAdd = function () {
        if ($scope.timerIsRunning) {
            lapTimer();
        }
        $scope.laps.reverse();
        $scope.laps.push($scope.timeStatus);
        $scope.laps.reverse();
   };

    // remove the lap from the lap list
    $scope.lapRemove = function (idx) {
        $scope.laps.splice(idx, 1);
    };

}]);

// service that split the time into minutes, seconds and milliseconds and returns an object
app.factory('timerService', function () {
    'use strict';
    return {
        split: function (time) {
            var result = {
                ms: (time % 100).toString(),
                seconds: (Math.floor(time / 100) % 60).toString(),
                minutes: (Math.floor(time / 6000)).toString()
            };

            if (result.minutes < 10) {
                result.minutes = '0' + result.minutes;
            }

            if (result.seconds < 10) {
                result.seconds = '0' + result.seconds;
            }

            if (result.ms < 10) {
                result.ms = '0' + result.ms;
            }

            return result;
        }
    };
});