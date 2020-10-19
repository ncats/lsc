module.exports = {
    name: '<%= appNameSlug %>',

    description: 'Description for <%= appNameSlug %>',

    /* Must be exact Angular Module name */
    entryModule: '<%= appNamePascalCase %>Module',

    /* Icon to be displayed in left-menu.
    See options in https://labshare.github.io/ls-font/ */
    defaultIcon: 'icon-lsi-info-fill',

    /* Events that the library subscribes to.
    Can come from the App or other libraries. */
    consumeEvents: [],

    /* Events that the library emits.
    Can be emitted to app or other libraries */
    emitEvents: []
}