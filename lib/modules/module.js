function Module(name) {
    this.name = name;
}

Module.prototype.understands = function() {
    return false;
};

Module.prototype.execute = function(input, callback) {
    callback();
};

module.exports = Module;