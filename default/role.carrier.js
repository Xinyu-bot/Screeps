const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

const STATE = {
	Sourcing: 1,
    Delivering: 2,
}


let roleCarrier = {

    /** 
	 * @param {Creep} creep 
	 */    
    run: function(creep) {
        // check state
        roleCarrier._state(creep);

	    // operate
        roleCarrier._operate(creep);
    }, 

	/**
	 * @param {Creep} creep 
	 */ 
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.target = null; // clear target
					creep.memory.state = STATE.Delivering;
                    roleCarrier._say(creep);  // shout to the GUI
				}
				break;
			
			case STATE.Delivering:
				if (creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.target = null; // clear target
					creep.memory.state = STATE.Sourcing;
                    roleCarrier._say(creep);  // shout to the GUI
				}
				break;

			// if we don't have a state, set it to Sourcing
			default:
				creep.memory.state = STATE.Sourcing;
                roleCarrier._say(creep);  // shout to the GUI
		}
	},

    /** 
	 * @param {Creep} creep 
	 */    
    _say: function(creep) {
        switch (creep.memory.state) {
            case STATE.Sourcing:
                creep.say(ROLE.SAY.SOURCE);
                break;

            case STATE.Delivering:
                creep.say(ROLE.SAY.DELIVER);
                break;
            
            default:
                creep.say(ROLE.SAY.WONDER);
        }
    },

    /** 
	 * @param {Creep} creep 
	 */    
    _operate: function(creep) {
        switch (creep.memory.state) {
            // find a container near a source, and withdraw energy from it
            case STATE.Sourcing:
                if (creep.memory.target) {
                    let target = Game.getObjectById(creep.memory.target);
                    if (target && target.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.target = null;
                    } else {
                        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                        break;
                    }
                }

                const targetSource = roleUtils.findSourceContainer(creep);
                if (targetSource) {
                    creep.memory.target = targetSource.id;
                    if(creep.withdraw(targetSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                break;

            // find a container near a controller, and transfer energy to it
            case STATE.Delivering:
                if (creep.memory.target) {
                    let target = Game.getObjectById(creep.memory.target);
                    if (target && target.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.target = null;
                    } else {
                        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                        break;
                    }
                }

                const targetContainer = roleUtils.findControllerContainer(creep);
                if (targetContainer) {
                    creep.memory.target = targetContainer.id;
                    if(creep.transfer(targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    break;
                }

                // if we don't have a container near the controller, we need to move to spawn
                const spawn = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN;
                    }
                });
                if (spawn.length > 0) {
                    creep.memory.target = spawn[0].id;
                    if(creep.transfer(spawn[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }

                break;

            default:
        }
    },

};

module.exports = roleCarrier;