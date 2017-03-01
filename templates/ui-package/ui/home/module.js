// Main file where module is defined, routes are added, and menu items are added
'use strict';

var angular = require('angular');
require('angular-ui-router');

module.exports = angular.module('labshare.<%= appNameSlug %>.home', ['ui.router']).config(['$stateProvider', function ($stateProvider) {
    $stateProvider
        .state('labshare-<%= appNameSlug %>-home', {
            data: {
                rolesRequired: ["user", "staff", "admin"]
            },
            url: '/<%= appNameSlug %>/home',
            template: require('./index.html'),
            controller: 'labshare.<%= appNameSlug %>.HomeCtrl',
            title: 'Home - <%= appNameSlug %>'
        });
}]);
