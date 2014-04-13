var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({filename: 'node-bot.log'})
    ]
});

module.exports = logger;