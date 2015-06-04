'use strict';
(function () {
    var app = angular.module("FRLLK.filters", ['FRLLK.services']);
    app.filter("merge", function () {
        return function (ls, key, n, omit) {
            var a = [];
            angular.forEach(ls, function (v, i) {
                if (n && n < i) return false;
                a.push(v[key]);
            })
            if (n && ls.length > n)
                return a.join(',') + (omit || '');
            return a.join(',');
        }
    });
    app.filter("none", function () {
        return function (obj, content) {
            if (obj == null || obj == '') {
                return content;
            }
            return obj;
        }
    })
})();