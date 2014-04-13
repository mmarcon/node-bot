var logger = require('../logger');

function Core(protocol, modules) {
    this.modules = modules;
    this.protocol = protocol;
}

Core.prototype.start = function() {
    var self = this;
    this.protocol.on('input', function(input){
        self.modules.some(function(module){
            logger.info('Trying to pass input to ' + module.name);
            if(module.understands(input)){
                module.execute(input, self.protocol.write.bind(self.protocol));
                return true;
            }
        });
    });
    this.protocol.on('start', function(){
        logger.info('bot protocol is starting');
    });
    this.protocol.on('stop', function(){
        logger.info('bot protocol is stopping');
    });
    this.protocol.start();
};

module.exports = Core;