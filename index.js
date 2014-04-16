var config = require('./config'),
    Core = require('./lib/core'),
    Module = require('./lib/modules/module'),
    Protocol = require('./lib/protocols/Protocol'),
    util = require('util');

var ProtocolConstructor = require(config.protocol)(Protocol, util.inherits);

var protocol = new ProtocolConstructor();

var loadedModules = config.modules.map(function(modulePath){
    var ModuleConstructor = require(modulePath)(Module, util.inherits);
    return new ModuleConstructor();
});

var core = new Core(
    protocol,
    loadedModules);

process.on('SIGINT', function() {
    core.stop();
    process.exit(0);
});

core.start();