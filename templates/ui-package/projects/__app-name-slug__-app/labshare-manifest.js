module.exports = {
    "type": "app",
    "modules": [
        {
            name: "@labshare/<%= appNameSlug %>",
            path: "@labshare/<%= appNameSlug %>",
            manifest: {
                defaultIcon: "icon-lsi-info-fill",
                entryModule: "<%= appNamePascalCase %>Module",
                description: "Description for <%= appNameSlug %>",
                consumeEvents: [],
                emitEvents: [],
                name: "<%= appNameSlug %>"
            }
        }
    ]
}