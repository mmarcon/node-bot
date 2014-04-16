module.exports = function moduleLoader(Module, inherits){
    function Time() {
        Module.call(this, 'Time');
    }

    inherits(Time, Module);

    Time.prototype.understands = function(cmd) {
        return (/time/ig).test(cmd);
    };

    Time.prototype.execute = function(input, respond) {
        var date = new Date(),
            hours = date.getHours(),
            minutes = date.getMinutes();
        respond('It is ' + hours + ':' + (minutes > 9 ? minutes : '0' + minutes));
    };
    return Time;
};