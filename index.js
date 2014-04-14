var config = require('./config'),
    Core = require('./lib/core');

var modules = {
    'time': require('./lib/modules/time'),
    'duckduckgo': require('./lib/modules/duckduckgo')
};

var protocols = {
    'repl': require('./lib/protocols/repl')
};

var loadedModules = config.modules.map(function(moduleName){
    return new modules[moduleName]();
});

var core = new Core(
    new protocols[config.protocol](),
    loadedModules);

process.on('SIGINT', function() {
    core.stop();
    process.exit(0);
});

core.start();