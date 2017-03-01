// ui/demoModule/demo-ctrl.js - example controller that extends angular module

var module = require('./module');

module.controller('labshare.<%= appNameSlug %>.HomeCtrl', ['$scope', function ($scope) {
    $scope.message = 'LabShare.<%= appNameSlug %>.Home';
}]);