var util = require('util');
var repl = require('repl');

var REPL_CONFIG = {
    prompt: "BOT> ",
    input: process.stdin,
    output: process.stdout
};

module.exports = function protocolLoader(Protocol, inherits){
    function Repl(){
        Protocol.call(this);
        //This is a bit dirty, but because of how the
        //node repl is designed I don't really have a choice.
        this.pendingCallback = function(){};
    }

    inherits(Repl, Protocol);

    Repl.prototype.start = function() {
        var self = this;
        var replConfiguration = {
            eval: function(cmd, context, filename, callback) {
                //Gets rid of the (cmd) thing
                cmd = cmd.replace(/^\(|\n|\)$/g, '');
                self.pendingCallback = callback;
                self.emit('input', cmd);
            }
        };
        util._extend(replConfiguration, REPL_CONFIG);
        repl.start(replConfiguration);
        this._start();
    };

    Repl.prototype.write = function(output) {
        this.pendingCallback(null, output);
    };

    Repl.prototype.stop = function() {
        this._stop();
    };

    return Repl;
};