var Module = require('./module');
var util = require('util');
var request = require('request');

function DuckDuckGo() {
    Module.call(this, 'DuckDuckGo');
}

util.inherits(DuckDuckGo, Module);

var REGEXP = /^define\s([^\s]+)$/i;

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
            respond(parsedResponse && parsedResponse.Definition);
        } catch(e) {
            return notifyError(respond, word);
        }
    });
};

module.exports = DuckDuckGo;