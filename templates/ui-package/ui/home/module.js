// Main file where module is defined, routes are added, and menu items are added
define([
    'angular',
    'angular-ui-router'
], function(angular) {
    return angular.module('labshare.<%= appNameSlug %>.home',['ui.router']).config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('labshare-<%= appNameSlug %>-home', {
                data: {
                    rolesRequired: ["user", "staff", "admin"]
                },
                url: '/<%= appNameSlug %>/home',
                templateUrl: 'packages/<%= appNameSlug %>/ui/home/index.html',
                controller: 'labshare.<%= appNameSlug %>.HomeCtrl',
                title: 'Home - <%= appNameSlug %>'
            });
        }])
});