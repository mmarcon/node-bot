var logger = require('../logger'),
    Noop = require('../modules/noop');

var noop = new Noop();

function Core(protocol, modules) {
    this.modules = modules;
    this.protocol = protocol;
}

Core.prototype.start = function() {
    this.protocol.on('input', this.handleInput.bind(this));
    this.protocol.on('start', function(){
        logger.info('bot protocol is starting');
    });
    this.protocol.on('stop', function(){
        logger.info('bot protocol is stopping');
    });
    this.protocol.start();
};

Core.prototype.stop = function() {
    this.protocol.stop();
};

Core.prototype.handleInput = function(input) {
    var module = this.pickModule(input);
    module.execute(input, this.protocol.write.bind(this.protocol));
};

Core.prototype.pickModule = function(input) {
    var pickedModule = noop;
    this.modules.some(function(module){
        logger.info('Verifying if ' + module.name + ' can handle <' + input + '>');
        if(module.understands(input)){
            pickedModule = module;
            return true;
        }
    });
    return pickedModule;
};

module.exports = Core;