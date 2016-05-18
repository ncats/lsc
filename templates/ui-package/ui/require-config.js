requirejs.config({
    paths: {
        angular: 'bower_components/angular/angular',
        'angular-animate': 'bower_components/angular-animate/angular-animate',
        'angular-cookies': 'bower_components/angular-cookies/angular-cookies',
        'angular-aria': 'bower_components/angular-aria/angular-aria',
        'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
        'angular-scenario': 'bower_components/angular-scenario/angular-scenario',
        'angular-resource': 'bower_components/angular-resource/angular-resource',
        'angular-route': 'bower_components/angular-route/angular-route',
        'angular-sanitize': 'bower_components/angular-sanitize/angular-sanitize',
        'angular-touch': 'bower_components/angular-touch/angular-touch',
        'angular-material': 'bower_components/angular-material/angular-material',
        'angular-ui-router': 'bower_components/angular-ui-router/release/angular-ui-router',
        'angular-messages': 'bower_components/angular-messages/angular-messages',
        'angular-ui-router-title': 'bower_components/angular-ui-router-title/angular-ui-router-title',
        lodash: 'bower_components/lodash/lodash'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        'angular-animate': [
            'angular'
        ],
        'angular-cookies': [
            'angular'
        ],
        'angular-aria': [
            'angular'
        ],
        'angular-route': [
            'angular'
        ],
        'angular-resource': [
            'angular'
        ],
        'angular-material': [
            'angular'
        ],
        'angular-mocks': [
            'angular'
        ],
        'angular-ui-router': [
            'angular'
        ],
        'angular-messages': [
            'angular'
        ],
        'angular-ui-router-title': [
            'angular'
        ],
        lodash: {
            exports: '_'
        }
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    },
    packages: [

    ]
});
