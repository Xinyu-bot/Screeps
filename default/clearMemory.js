var clearMemory = {

    run: function() {
        this._clearCreep()
    },

    _clearCreep: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name]
                this._clearFlagMemory(name)
                console.log("Clearing non-existing creep memory:", name)
            }
        }
    },

    /** 
     * @param {String} creepName
     */
    _clearFlagMemory: function(creepName) {
        for (let flagName in Game.flags) {
            let flag = Game.flags[flagName]
            if (flag.memory.creepId == creepName) {
                flag.memory.creepId = null
                console.log("Clearing flag memory:", flagName, "for creep:", creepName)
                return
            }
        }
    },
}; 

module.exports = clearMemory;