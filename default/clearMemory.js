var clearMemory = {

    run: function() {
        this._clearCreep()
    },

    _clearCreep: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name]
                console.log("Clearing non-existing creep memory:", name)
            }
        }
    },

}; 

module.exports = clearMemory;