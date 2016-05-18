// src/ui/demoModule/demo-ctrl.js - example controller that extends angular module
define(['./module'], function (module) {
    return module.controller('labshare.<%= appNameSlug %>.HomeCtrl', ['$scope', function ($scope) {
        $scope.message = 'LabShare.<%= appNameSlug %>.Home';
    }]);
});