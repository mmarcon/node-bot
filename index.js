var config = require('./config'),
    Core = require('./lib/core'),
    Noop = require('./lib/modules/noop');

var modules = {
    'time': require('./lib/modules/time'),
};

var protocols = {
    'repl': require('./lib/protocols/repl')
};

var loadedModules = config.modules.map(function(moduleName){
    return new modules[moduleName]();
});

loadedModules.push(new Noop());

var core = new Core(
    new protocols[config.protocol](),
    loadedModules);

core.start();