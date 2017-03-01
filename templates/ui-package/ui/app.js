// The main AngularJS module of <%= appNameSlug %>
'use strict';

var angular = require('angular');
require('./home/index');

module.exports = angular.module('labshare.<%= appNameSlug %>', [
    'labshare.<%= appNameSlug %>.home'
]);
