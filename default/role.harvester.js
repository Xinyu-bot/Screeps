const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

let roleHarvester = {

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */    
    run: function(creep) {
        // shout to the GUI
        roleHarvester._say(creep);

	    // operate
        roleHarvester._operate(creep);
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
	        creep.say(ROLE.SAY.DELIVER);
	    }
    },

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */    
    _operate: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            let source = roleUtils.findSource(creep);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },

};

module.exports = roleHarvester;