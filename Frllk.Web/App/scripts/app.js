'use strict';
(function () {
    var app = angular.module("FRLLK", ['ngRoute', 'ui.bootstrap', 'FRLLK.services', "FRLLK.controller", "FRLLK.directives", "FRLLK.filters"]);
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        //路由配置
        var route = $routeProvider;
        route.when("/authority/user/", { controller: 'users', templateUrl: '/authority-user' })
        route.when("/authority/functionality/", { controller: 'functionality', templateUrl: '/authority-functionality' })
        route.when("/authority/roles/", { controller: 'roles', templateUrl: '/authority-roles' })
        route.when("/", { redirectTo: '/authority/user/' })
        route.otherwise({ templateUrl: '/utility-404' });
    }])
})();
