'use strict';
(function () {
    var app = angular.module("FRLLK.directives", ['FRLLK.services']);
    app.directive('ceCheck', [function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, iElement) {
                var all = "thead input[type='checkbox']";
                var item = "tbody input[type='checkbox']";
                iElement.on("change", all, function () {
                    var o = $(this).prop("checked");
                    var tds = iElement.find(item);
                    tds.each(function (i, check) {
                        $(check).prop("checked", o);
                    });
                });
                iElement.on("change", item, function () {
                    var o = $(this).prop("checked");
                    var isChecked = true;
                    if (o) {
                        iElement.find(item).each(function () {
                            if (!$(this).prop("checked")) {
                                isChecked = false;
                                return false;
                            }
                            return true;
                        });
                    }
                    iElement.find(all).prop("checked", o && isChecked);
                });
            }
        };
    }]);
    app.directive('ceFilter', [function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, iElement, iAttr) {
                var select = "input[type='checkbox']";
                var methods = {
                    lessMore: function () {
                        var checkes = iElement.find(select);
                        var isChecked = $(this).prop("checked");
                        if (!isChecked) return;
                        var length = checkes.length;
                        var i = checkes.index(this);
                        if (i == 0 || i == 1 || i == length - 1) {
                            checkes.not(this).prop("checked", false);
                        }
                        else {
                            checkes.slice(0, 2).prop("checked", false);
                            checkes.last().prop("checked", false);
                        }
                        checkes.each(function () {
                            var v = $(this).scope();
                            v.item.isChecked = $(this).prop("checked");
                            v.$apply();
                        })
                    },
                    allOther: function () {
                        var checkes = iElement.find(select);
                        var isChecked = $(this).prop("checked");
                        if (!isChecked) return;
                        var i = checkes.index(this);
                        if (i == 0) {
                            checkes.not(this).prop("checked", false);
                        }
                        else {
                            checkes.eq(0).prop("checked", false);
                        }
                        checkes.each(function () {
                            var v = $(this).scope();
                            v.item.isChecked = $(this).prop("checked");
                            v.$apply();
                        })
                    },
                    call: function () {
                        switch (iAttr.ceFilter) {
                            case 'less-more':
                                return methods.lessMore;
                            case 'all-other':
                                return methods.allOther;
                        }
                    }
                };
                iElement.on("change", select, methods.call());
            }
        }

    }]);
    app.directive('ceCast', [function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, iElement, iAttr) {
                iElement.on("change", function () {
                    var v = /\-?\d+(\.\d+)?/.exec($(this).val());
                    $(this).val(v && v[0] ? v[0] : 0);
                    scope.$apply();
                });
            }
        }
    }]);
    app.directive('ceEnter', [function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, element, attr) {
                element.bind('keypress', function (event) {
                    if (event.keyCode == '13') {
                        var call = scope[attr["ceEnter"]];
                        return typeof call == "function" && call();
                    }
                });
            }
        };
    }]);
    app.directive('ceChoose', [function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, element, attr) {
                element.on("click", "button", function () {
                    var bt = $(this);
                    if (bt.hasClass("btn-default")) {
                        bt.removeClass("btn-default").addClass("btn-success")
                    }
                    else {
                        bt.removeClass("btn-success").addClass("btn-default")
                    }
                    var v = [];
                    element.find(".btn-success").each(function () {
                        v.push($(this).text());
                    })
                    scope.contains = v;
                    scope.$apply();
                    scope[attr["ceChoose"]]();
                })
            }
        }
    }]);
    app.directive('ceTree', [function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, element, attrs) {
                scope.service.get(0);
                var setting = {
                    async: {
                        enable: true,
                        url: "/api/company/GetChilds/",
                        autoParam: ["Id"],
                        dataFilter: filter
                    },
                    data: {
                        key: {
                            name: "Name",
                        }
                    }
                };

                function filter(treeId, parentNode, data) {
                    $.each(data.Data, function (i, v) {
                        v.isParent = v.Total > 0;
                    })
                    return data.Data;
                }
                $.fn.zTree.init(element, setting);
            }
        };
    }]);
})();

