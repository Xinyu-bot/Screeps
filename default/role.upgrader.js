const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

let roleUpgrader = {

    /** 
     * 
     * @param {Creep} creep 
     * 
     */
    run: function(creep) {
        // shout to the GUI
        roleUpgrader._say(creep);

	    // operate
        roleUpgrader._operate(creep);
    }, 

    /** 
     * 
     * @param {Creep} creep 
     * 
     */
    _say: function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say(ROLE.SAY.HARVEST);
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say(ROLE.SAY.UPGRADE);
	    }
    },

    /** 
     * 
     * @param {Creep} creep 
     * 
     */
    _operate: function(creep) {
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                creep.signController(creep.room.controller, "From the void we came; into the void we shall return.");
            }
        }
        else {
            let source = roleUtils.findSource(creep);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    },
    
};

module.exports = roleUpgrader;