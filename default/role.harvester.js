const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

const STATE = {
	Sourcing: 1,
    Delivering: 2,
}


let roleHarvester = {

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */    
    run: function(creep) {
        // check state
        roleHarvester._state(creep);

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
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
					creep.memory.state = STATE.Delivering;
				}
				break;
			
			case STATE.Delivering:
				if (creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.state = STATE.Sourcing;
				}
				break;

			// if we don't have a state, set it to Sourcing
			default:
				creep.memory.state = STATE.Sourcing;
		}
	},

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */    
    _say: function(creep) {
        // we speak every 10 ticks
		if (creep.ticksToLive % 10) return;

        switch (creep.memory.state) {
            case STATE.Sourcing:
                creep.say(ROLE.SAY.HARVEST);
                break;

            case STATE.Delivering:
                creep.say(ROLE.SAY.DELIVER);
                break;
            
            default:
                creep.say(ROLE.SAY.WONDER);
        }
    },

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 */    
    _operate: function(creep) {
        switch (creep.memory.state) {
            case STATE.Sourcing:
                let source = roleUtils.findSource(creep);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                break;

            case STATE.Delivering:
                // find an extension or spawn
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                // if we can't find an extension or spawn, try to find a container
                if(!target) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                                // make sure the container is close to a source, not the controller
                                structure.pos.findInRange(FIND_SOURCES, 3).length > 0;
                        }
                    });
                }

                // if we find a target, transfer energy to it
                if (target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                break;

            default:
        }
    },

};

module.exports = roleHarvester;