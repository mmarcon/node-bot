var fs = require('fs'),
    markov = require('markov');

var MARKOV_CONFIG = {
    filename: 'markov-seed.txt',
    replyWithProbability: 0.2
};

module.exports = function moduleLoader(Module, inherits, logger){
    function Markov() {
        Module.call(this, 'Markov');
        this.markov = markov(1);
        this.ready = false;
        init.call(this);
    }

    function init() {
        var s = fs.createReadStream(MARKOV_CONFIG.filename),
            self = this;
        this.markov.seed(s, function(error){
            if(error) {
                logger.error('Markov module: seeding error');
                self.ready = false;
                return;
            }
            logger.info('Markov module: ready');
            self.ready = true;
        });
    }

    inherits(Markov, Module);

    Markov.prototype.understands = function() {
        var random = Math.random();
        logger.info('Markov module: random number is ' + random + ' replyWithProbability is ' + MARKOV_CONFIG.replyWithProbability);
        if(MARKOV_CONFIG.replyWithProbability > random && this.ready) {
            logger.info('Markov module: is going to reply to this one');
            return true;
        }
        logger.info('Markov module: is NOT going to reply to this one');
        return false;
    };

    Markov.prototype.execute = function(input, respond) {
        var response = this.markov.respond(input).join(' ');
        respond(response);
    };
    return Markov;
};