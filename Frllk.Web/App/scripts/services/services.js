'use strict';
(function () {
    var service = angular.module('FRLLK.services', []);
    service.factory("http", ['$http', '$modal', 'utility', function ($http, $modal, utility) {
        var methods = {
            'call': function (type, url, params, data) {
                return $http({ method: type, url: url, params: params, data: data }).success(methods.success).error(methods.errorModal);
            },
            'success': function (data) {
                if (data.Message)
                    utility.confirm({ msg: data.Message, ok: '确定' });
                return data;
            },
            'errorModal': function (data) {
                $modal.open({
                    templateUrl: 'utility-errorModal ',
                    backdrop: "static",
                    controller: "errorModal",
                    resolve: {
                        error: function () {
                            return data;
                        }
                    }
                });
            },
            'get': function (url, params) {
                return methods.call('GET', url, params);
            },
            'put': function (url, data) {
                return methods.call('PUT', url, undefined, data);
            },
            'post': function (url, data) {
                return methods.call('POST', url, undefined, data);
            },
            'delete': function (url, data) {
                return methods.call('DELETE', url, undefined, data);
            }
        }
        return methods;
    }])
    service.factory("linkService", function () {
        var links = [];
        links.push({
            name: '权限管理', urls: [
                { link: '/authority/user/', title: '用户管理' },
                { link: '/authority/roles/', title: "角色管理" },
                { link: '/authority/functionality/', title: "功能管理" }
            ]
        });
        return links;
    });
    service.factory("authorityService", ["http", function (http) {
        var methods = {
            users: {
                'get': function (params) {
                    return http.get("/api/users/get", params);
                },
                'post': function (params) {
                    return http.post("/api/users/post", params);
                },
                'put': function (params) {
                    return http.put("/api/users/put", params);
                },
                'delete': function (id) {
                    return http.delete("/api/users/delete/" + id);
                },
                'pwdPut': function (params) {
                    return http.put("/api/users/pwdPut/", params);
                },
                'rolesPut': function (params) {
                    return http.put("/api/users/rolesPut", params);
                }
            },
            roles: {
                'get': function (params) {
                    return http.get("/api/roles/get", params);
                },
                'put': function (params) {
                    return http.put("/api/roles/put", params);
                },
                'post': function (params) {
                    return http.post("/api/roles/post", params);
                },
                'delete': function (id) {
                    return http.delete("/api/roles/delete/" + id);
                },
                'permissionPut': function (params) {
                    return http.put("/api/roles/permissionPut/", params);
                }
            },
            functionality: {
                'get': function (params) {
                    return http.get("/api/functionality/get", params);
                },
                'put': function (params) {
                    return http.put("/api/functionality/put", params);
                },
                'post': function (params) {
                    return http.post("/api/functionality/post", params);
                },
                'delete': function (id) {
                    return http.delete("/api/functionality/delete/" + id);
                }
            }
        };
        return methods;
    }]);
    service.factory("utility", ['$modal', function ($modal) {
        var methods = {
            confirm: function (text) {
                return $modal.open({
                    templateUrl: 'utility-confirmModal ',
                    backdrop: "static",
                    controller: "confirmmModal",
                    resolve: {
                        items: function () {
                            return text;
                        }
                    }
                });
            },
            notify: function (content, type) {
                $.notify(content, { type: type, delay: 100, z_index: 1000000, placement: { from: 'top', align: 'right' } });
            },
            remove: function (list, item) {
                angular.forEach(list, function (i, v) {
                    if (i.$$hashKey == item.$$hashKey) {
                        list.splice(v, 1);
                        return false;
                    }
                })
            }
        }
        return methods
    }]);
    service.factory("language", [function ($window) {
        return $window.language || [];
    }])
    service.controller("confirmmModal", ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
        var methods = {
            ok: function () {
                $modalInstance.close(true);
            },
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            text: items
        };
        $.extend($scope, methods);
    }]);
    service.controller("errorModal", ['$scope', '$modalInstance', 'error', function ($scope, $modalInstance, error) {
        var methods = {
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            report: function () {
                $modalInstance.close(true);
            }
        }
        angular.extend($scope, methods, error);
    }]);
})();
