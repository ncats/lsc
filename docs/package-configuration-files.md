### Working with package configuration files [Optional]

LabShare packages can define a configuration file named `config.json` inside the package's root directory.

#### Accessing config file data

In the server-side, all configuration file data will be read by the Shell at start up and stored in a global `LabShare.Config` object. 
To access the config values you defined, use your package's lowercase `package.json` 'namespace' value (or 'name' if you did not define a 'namespace')
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

To override the configuration for one or more locally installed packages, specify the package name and an object containing the modified 
property names and values.

Note:
The additional objects containing package configuration override data will be removed after LSC finishes initialization.

Example:
```javascript
//<package-name>/config.json
{
    "foo": "bar",
    "some-other-package": {
        "Listen": {
            "Port": 9000
        }
    }
}
```

With the above configuration file, `some-other-package` would use a port configuration of `9000`.
