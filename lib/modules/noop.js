var Module = require('./module');
var util = require('util');

function Noop() {
    Module.call(this, 'Noop');
}

util.inherits(Noop, Module);

Noop.prototype.understands = function() {
    return true;
};

Noop.prototype.execute = function(input, respond) {
    respond(false);
};

module.exports = Noop;