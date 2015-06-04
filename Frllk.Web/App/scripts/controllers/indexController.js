'use strict';
(function () {
    var app = angular.module("FRLLK.controller", []);
    app.controller("navigation", ['$scope', '$location', '$routeParams', 'linkService', function ($scope, $location, $routeParams, linkService) {
        $scope.urls = linkService[0].urls;
    }]);
})()