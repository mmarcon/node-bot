var request = require('request');

var REGEXP = /^define\s([^\s]+)$/i;

module.exports = function moduleLoader(Module, inherits){
    function DuckDuckGo() {
        Module.call(this, 'DuckDuckGo');
    }

    inherits(DuckDuckGo, Module);

    DuckDuckGo.prototype.understands = function(cmd) {
        return REGEXP.test(cmd);
    };

    function notifyError(respond, word) {
        respond('Something very very bad happened and I could not find a definition for ' + word);
    }

    DuckDuckGo.prototype.execute = function(input, respond) {
        var word = input.match(REGEXP),
            url = 'http://api.duckduckgo.com/?format=json&q=' + word[1];
        request.get(url, function(error, response, body){
            var parsedResponse;
            if(error) {
                return notifyError(respond, word);
            }
            try {
                parsedResponse = JSON.parse(body);
                if(parsedResponse && parsedResponse.Definition && parsedResponse.Definition.length > 0) {
                    return respond(parsedResponse.Definition);
                }
                respond('I couldn\'t find a definition for ' + word[1]);
            } catch(e) {
                return notifyError(respond, word[1]);
            }
        });
    };

    return DuckDuckGo;
};