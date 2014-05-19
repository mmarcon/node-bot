/**
 * Youtube search module
 *
 * keyphrase: "watch {search terms}"
 * i.e. 
 * "watch sleepy kittens"
 * http://www.youtube.com/v/UE3BwvzYrOc
 * 
 * Add a Google API key as config.youtubeKey to use the (better) v3 API
 */

var request = require('request');

var REGEXP = /^watch\s(.*)$/i;

module.exports = function moduleLoader(Module, inherits, logger, config) {
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
            searchTerm = word[1].replace(/\+/g, '%2B').replace(/\s/g, '+'),
            url = 'https://gdata.youtube.com/feeds/api/videos?q=' + word[1].replace(/\s/g, '+') + '&orderby=published&max-results=1&v=2&alt=json';
        if (config.youtubeKey) {
            //use v3
            url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + searchTerm + '&type=video&key=' + config.youtubeKey;
        }

        request.get(url, function(error, response, body) {
            var parsedResponse;
            if (error) {
                return notifyError(respond, word);
            }
            try {
                if (config.youtubeKey) {
                    // use v3
                    parsedResponse = JSON.parse(body);
                    if (parsedResponse && parsedResponse.items && parsedResponse.items.length > 0) {
                        return respond("http://www.youtube.com/watch?v=" + parsedResponse.items[0].id.videoId);
                    }
                }
                //use v2
                parsedResponse = JSON.parse(body);
                if (parsedResponse && parsedResponse.feed && parsedResponse.feed.entry && parsedResponse.feed.entry.length > 0) {
                    return respond(parsedResponse.feed.entry[0].link[0].href);
                }
                respond('I couldn\'t find a video for ' + word[1]);
            } catch (e) {
                return notifyError(respond, word[1]);
            }
        });
    };

    return YouTube;
};