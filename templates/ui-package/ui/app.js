// The main AngularJS module of <%= appNameSlug %>
define([
    'angular',
    './home/index'
], function (angular) {
    'use strict';
    return angular.module('labshare.<%= appNameSlug %>', [
        'labshare.<%= appNameSlug %>.home'
    ]);
});