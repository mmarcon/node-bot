var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Protocol(){
    EventEmitter.call(this);
}

util.inherits(Protocol, EventEmitter);

Protocol.prototype._start = function() {
    this.emit('start');
};

Protocol.prototype._stop = function() {
    this.emit('stop');
};

module.exports = Protocol;