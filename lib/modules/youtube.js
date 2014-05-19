var request = require('request');

var REGEXP = /^watch\s(.*)$/i;

module.exports = function moduleLoader(Module, inherits){
    function YouTube() {
        Module.call(this, 'YouTube');
    }

    inherits(YouTube, Module);

    YouTube.prototype.understands = function(cmd) {
        return REGEXP.test(cmd);
    };

    function notifyError(respond, word) {
        respond('Something very very bad happened and I could not find a video for ' + word);
    }

    YouTube.prototype.execute = function(input, respond) {
        var word = input.match(REGEXP),
            url = 'https://gdata.youtube.com/feeds/api/videos?q=' + word[1].replace(/\s/g, '+') + '&orderby=published&max-results=1&v=2&alt=json';
        request.get(url, function(error, response, body){
            var parsedResponse;
            if(error) {
                return notifyError(respond, word);
            }
            try {
                parsedResponse = JSON.parse(body);
                if(parsedResponse && parsedResponse.feed && parsedResponse.feed.entry && parsedResponse.feed.entry.length > 0) {
                    return respond(parsedResponse.feed.entry[0].link[0].href);
                }
                respond('I couldn\'t find a video for ' + word[1]);
            } catch(e) {
                return notifyError(respond, word[1]);
            }
        });
    };

    return YouTube;
};