'use strict';
(function () {
    var app = angular.module("FRLLK.controller");
    app.controller("users", ['$scope', 'authorityService', 'utility', '$modal', function ($scope, authorityService, utility, $modal) {
        var service = authorityService.users;
        var methods = {
            search: function (isPage) {
                $scope.loadingState = true;
                if (!isPage) $scope.current = 1;
                var params = { name: $scope.Name || '', current: $scope.current || 0, size: $scope.size, type: $scope.type || 0 };
                service.get(params).success(function (data) {
                    $scope.list = data.Data;
                    $scope.total = data.Total;
                    $scope.loadingState = false;
                });
            },
            edit: function (item) {
                item.isModified = true;
                item.org = angular.copy(item);
            },
            active: function (item) {
                item.IsActive = !item.IsActive
                if (item.Password == '') {
                    methods.setPassword();
                }
            },
            create: function () {
                var O = { "Id": 0, "Name": "", "Roles": [], isModified: true };
                $scope.list.unshift(O);
            },
            save: function (item) {
                if ($.trim(item.Name) == '' || $.trim(item.Email) == '') {
                    return;
                }
                delete item.org;
                if (item.Id > 0) {
                    service.put(item).success(function (data) {
                        if (data.isSaved) {
                            utility.notify("保存成功！", "success");
                            item.isModified = false;
                        }
                    })
                }
                else {
                    methods.setPassword(item, function () {
                        service.post(item).success(function (data) {
                            if (data.isCreated) {
                                utility.notify("创建成功！", "success");
                                item.isModified = false;
                                item.Id = data.Id;
                            }
                        })
                    });
                }
            },
            cancel: function (item) {
                if (item.Id > 0) {
                    var v = item.org;
                    delete item.org;
                    angular.extend(item, v);
                }
                else {
                    utility.remove($scope.list, item)
                }
            },
            setPassword: function (item, call) {
                var set = function () {
                    service.pwdPut(item).success(function (data) {
                        if (data.isSaved) {
                            utility.notify("重置密码成功！", "success");
                        }
                    })
                }
                var model = $modal.open({
                    templateUrl: 'authority-setPassword',
                    backdrop: "static",
                    controller: "setPassword",
                    resolve: {
                        params: function () {
                            return item;
                        }
                    }
                });
                model.result.then(call || set);
            },
            chooseRoles: function (item) {
                if (item.Id <= 0) {
                    utility.confirm({ msg: "保存当前用户后，关联角色", ok: "确定" });
                    return;
                }
                $modal.open({
                    templateUrl: 'authority-chooseRoles',
                    backdrop: "static",
                    controller: "chooseRoles",
                    size: 'lg',
                    resolve: {
                        params: function () {
                            return item;
                        }
                    }
                });
            },
            remove: function (item) {
                var model = utility.confirm({ msg: "删除用户不可恢复，是否删除当前用户？", ok: '确定删除', cancel: "取消" });
                model.result.then(function () {
                    service.delete(item.Id).success(function (data) {
                        if (data.isDeleted) {
                            utility.notify("删除用户成功！", "success");
                            utility.remove($scope.list, item);
                        }
                    });
                });
            },
            size: 10
        };
        angular.extend($scope, methods);
        methods.search();
    }]);
    app.controller("setPassword", ['$scope', 'authorityService', '$modalInstance', 'params', 'utility', function ($scope, authorityService, $modalInstance, params, utility) {
        var service = authorityService.users;
        var methods = {
            cancel: function () {
                $modalInstance.dismiss('cancel');
            },
            check: function () {
                return !/[a-z0-9@_]{8,}/.test($scope.Password || '');
            },
            ok: function () {
                if (methods.check() || $scope.Password != $scope.confirmPwd) {
                    return;
                }
                params.Password = $scope.Password;
                $modalInstance.close(true);
            },
            Name: params.Name,
        }
        angular.extend($scope, methods);
    }])
    app.controller("chooseRoles", ['$scope', 'authorityService', '$modalInstance', 'params', 'utility', function ($scope, authorityService, $modalInstance, params, utility) {
        var service = authorityService.users;
        var methods = {
            search: function () {
                $scope.loadingState = true;
                var obj = { current: $scope.current, size: $scope.size, name: $scope.name };
                authorityService.roles.get(obj).success(function (data) {
                    angular.forEach(data.Data, function (v, i) {
                        angular.forEach(params.Roles, function (p, i) {
                            if (v.Id == p.Id) {
                                v.isChecked = true;
                                return false;
                            }
                        })
                    })
                    $scope.list = data.Data;
                    $scope.total = data.Total;
                    $scope.loadingState = false;
                })
            },
            choose: function (item) {
                item.isChecked = !item.isChecked;
                var z = -1;
                angular.forEach(params.Roles, function (v, i) {
                    if (v.Id == item.Id) {
                        z = i;
                        return false;
                    }
                })
                if (item.isChecked && z == -1)
                    params.Roles.push({ Id: item.Id, Name: item.Name });
                if (!item.isChecked && z != -1)
                    params.Roles.splice(z, 1);
            },
            ok: function () {
                service.rolesPut(params).success(function (data) {
                    if (data.isSaved) {
                        utility.notify("权限修改成功！", "success");
                        $modalInstance.close(true);
                    }
                })
            },
            size: 10
        }
        angular.extend($scope, methods);
        methods.search();
    }]);
    app.controller("roles", ['$scope', 'authorityService', 'utility', '$modal', function ($scope, authorityService, utility, $modal) {
        var service = authorityService.roles;
        var methods = {
            search: function () {
                $scope.loadingState = true;
                var obj = { current: $scope.current, size: $scope.size, name: $scope.name };
                authorityService.roles.get(obj).success(function (data) {
                    $scope.list = data.Data;
                    $scope.total = data.Total;
                    $scope.loadingState = false;
                })
            },
            edit: function (item) {
                item.org = angular.copy(item);
                item.isModified = true;
            },
            cancel: function (item) {
                if (item.Id > 0) {
                    var v = item.org;
                    delete item.org;
                    angular.extend(item, v);
                    item.isModified = false;
                }
                else {
                    utility.remove($scope.list, item)
                }
            },
            chooseFunctionality: function (item) {
                if (item.Id <= 0) {
                    utility.confirm({ msg: "保存当前角色后，添加权限", ok: "确定" });
                    return;
                }
                $modal.open({
                    templateUrl: 'authority-chooseFunctionality',
                    backdrop: "static",
                    controller: "chooseFunctionality",
                    //size: 'lg',
                    resolve: {
                        params: function () {
                            return item;
                        }
                    }
                });
            },
            save: function (item) {
                if ($.trim(item.Name) == '') {
                    return;
                }
                if (item.Id > 0) {
                    service.put(item).success(function (data) {
                        if (data.isSaved) {
                            utility.notify("保存成功！", "success");
                            item.isModified = false;
                        }
                    })
                }
                else {
                    service.post(item).success(function (data) {
                        if (data.isCreated) {
                            utility.notify("创建成功！", "success");
                            item.isModified = false;
                            item.Id = data.Id;
                        }
                    })
                }
            },
            create: function (item) {
                var o = { "Funs": [], "Users": [], "Id": 0, "Name": "", "isModified": true };
                $scope.list.unshift(o);
            },
            remove: function (item) {
                var model = utility.confirm({ msg: "删除角色不可恢复，是否删除当前角色？", ok: '确定删除', cancel: "取消" });
                model.result.then(function () {
                    service.delete(item.Id).success(function (data) {
                        if (data.isDeleted) {
                            utility.notify("删除角色成功！", "success");
                            utility.remove($scope.list, item);
                        }
                    });
                });
            },
        }
        angular.extend($scope, methods);
        methods.search();
    }]);
    app.controller("chooseFunctionality", ['$scope', 'authorityService', '$modalInstance', 'params', 'utility', function ($scope, authorityService, $modalInstance, params, utility) {
        var service = authorityService.roles;
        var methods = {
            search: function () {
                $scope.loadingState = true;
                var obj = { current: $scope.current, size: $scope.size, name: $scope.name };
                authorityService.functionality.get(obj).success(function (data) {
                    angular.forEach(data.Data, function (v, i) {
                        angular.forEach(params.Funs, function (p, i) {
                            if (v.Id == p.Id) {
                                v.isChecked = true;
                                return false;
                            }
                        })
                    })
                    $scope.list = data.Data;
                    $scope.total = data.Total;
                    $scope.loadingState = false;
                })
            },
            choose: function (item) {
                item.isChecked = !item.isChecked;
                var z = -1;
                angular.forEach(params.Funs, function (v, i) {
                    if (v.Id == item.Id) {
                        z = i;
                        return false;
                    }
                })
                if (item.isChecked && z == -1)
                    params.Funs.push({ Id: item.Id, Name: item.Name });
                if (!item.isChecked && z != -1)
                    params.Funs.splice(z, 1);
            },
            ok: function () {
                service.permissionPut(params).success(function (data) {
                    if (data.isSaved) {
                        utility.notify("权限修改成功！", "success");
                        $modalInstance.close(true);
                    }
                })
            },
            size: 10
        }
        angular.extend($scope, methods);
        methods.search();
    }]);
    app.controller("functionality", ['$scope', 'authorityService', 'utility', function ($scope, authorityService, utility) {
        var service = authorityService.functionality;
        var methods = {
            search: function () {
                $scope.loadingState = true;
                var obj = { current: $scope.current, size: $scope.size, name: $scope.name };
                service.get(obj).success(function (data) {
                    $scope.list = data.Data;
                    $scope.total = data.Total;
                    $scope.loadingState = false;
                })
            },
            edit: function (item) {
                item.org = angular.copy(item);
                item.isModified = true;
            },
            cancel: function (item) {
                if (item.Id > 0) {
                    var v = item.org;
                    delete item.org;
                    angular.extend(item, v);
                    item.isModified = false;
                }
                else {
                    utility.remove($scope.list, item)
                }
            },
            save: function (item) {
                if ($.trim(item.Name) == '') {
                    return;
                }
                if (item.Id > 0) {
                    service.put(item).success(function (data) {
                        if (data.isSaved) {
                            utility.notify("保存成功！", "success");
                            item.isModified = false;
                        }
                    })
                }
                else {
                    service.post(item).success(function (data) {
                        if (data.isCreated) {
                            utility.notify("创建成功！", "success");
                            item.isModified = false;
                            item.Id = data.Id;
                        }
                    })
                }
            },
            create: function (item) {
                var o = { "Roles": [], "Users": [], "Id": 0, "Name": "", "isModified": true };
                $scope.list.unshift(o);
            },
            remove: function (item) {
                var model = utility.confirm({ msg: "删除功能不可恢复，是否删除当前功能？", ok: '确定删除', cancel: "取消" });
                model.result.then(function () {
                    service.delete(item.Id).success(function (data) {
                        if (data.isDeleted) {
                            utility.notify("删除功能成功！", "success");
                            utility.remove($scope.list, item);
                        }
                    });
                });
            },
        }
        angular.extend($scope, methods);
        methods.search();
    }]);
})()