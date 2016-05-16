var module = module.exports;

// This is an intentional duplicate command
module.hello = function (cb) {
    cb(null);
};

module.usage = [
    "hello - how to use"
];
