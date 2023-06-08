const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

let roleBuilder = {

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 * */
    run: function(creep) {
        // shout to the GUI
        roleBuilder._say(creep);

	    // operate
        roleBuilder._operate(creep);
    }, 

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */
    _say: function(creep) {
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say(ROLE.SAY.HARVEST);
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;

	        creep.say(ROLE.SAY.BUILD);
	    }
    },

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */
    _operate: function(creep) {
	    if(creep.memory.building) {
	        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
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

module.exports = roleBuilder;