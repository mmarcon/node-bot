try {
    var config = require('./config'),
        Core = require('./lib/core'),
        Module = require('./lib/modules/module'),
        Protocol = require('./lib/protocols/Protocol'),
        logger = require('./lib/logger'),
        util = require('util');

    var ProtocolConstructor = require(config.protocol)(Protocol, util.inherits);

    var protocol = new ProtocolConstructor();

    var loadedModules = config.modules.map(function(modulePath){
        var ModuleConstructor = require(modulePath)(Module, util.inherits, logger);
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
} catch(e) {
    console.error('Something wrong here. Did you add config.json?')
}