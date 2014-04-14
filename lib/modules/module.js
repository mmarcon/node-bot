function Module(name) {
    this.name = name;
}

Module.prototype.understands = function() {
    return false;
};

Module.prototype.execute = function(input, respond) {
    respond();
};

module.exports = Module;