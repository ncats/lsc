### Working with project configuration files [Optional]

Configuration files named `config.json` in LabShare project root directories will be automatically read by `lsc`.

#### Accessing configuration file data

Server-side, all configuration file data will be read by `lsc` at start up and stored in the `global.LabShare.Config` object.
To access the config values you defined, use your project's lowercase `package.json` 'namespace' value (or 'name' if you did not define a 'namespace')
as the key to the `global.LabShare.Config` object.

Example config file:
```javascript
// config.json
{
 "Value": 5,
 "Foo": "Bar"
}
```

#### Example: accessing config file data in the NodeJS environment
```
// my-module.js
global.LabShare.Config['my-package-name'].Value === 5;
global.LabShare.Config['my-package-name'].Foo === 'Bar';
```

#### Overriding configuration values

To override the configuration for one or more locally installed packages, specify the project name and an object containing the modified
property names and values.

Note:
The additional objects containing project configuration override data will be removed after `lsc` finishes initializing.

Example:
```javascript
//<project-name>/config.json
{
    "foo": "bar",
    "some-other-package": {
        "Listen": {
            "Port": 9000
        }
    }
}
```

With the above configuration file, `some-other-package`'s would use a port configuration of `9000`.
