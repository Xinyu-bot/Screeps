const ROLE = require("./role.const")
const roleUtils = require("./role.utils")

const STATE = {
	Sourcing: 1,
    Distributing: 2,
}


let roleDistributor = {

    /** 
	 * @param {Creep} creep 
	 */    
    run: function(creep) {
        // check state
        roleDistributor._state(creep)

	    // operate
        roleDistributor._operate(creep)
    }, 

	/**
	 * @param {Creep} creep 
	 */ 
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.target = null; // clear target
					creep.memory.state = STATE.Distributing
                    roleDistributor._say(creep);  // shout to the GUI
				}
				break
			
			case STATE.Distributing:
				if (creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.target = null; // clear target
					creep.memory.state = STATE.Sourcing
                    roleDistributor._say(creep);  // shout to the GUI
				}
				break

			// if we don't have a state, set it to Sourcing
			default:
				creep.memory.state = STATE.Sourcing
                roleDistributor._say(creep);  // shout to the GUI
		}
	},

    /** 
	 * @param {Creep} creep 
	 */    
    _say: function(creep) {
        switch (creep.memory.state) {
            case STATE.Sourcing:
                creep.say(ROLE.SAY.SOURCE)
                break

            case STATE.Distributing:
                creep.say(ROLE.SAY.DELIVER)
                break
            
            default:
                creep.say(ROLE.SAY.WONDER)
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
                    let target = Game.getObjectById(creep.memory.target)
                    if (target && target.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.target = null
                    } else {
                        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                        break
                    }
                }

                // source from storage
                // this should be the end of the logic chain for most of the time
                const targetSourceStorage = creep.room.storage
                if (targetSourceStorage && targetSourceStorage.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.target = targetSourceStorage.id
                    if(creep.withdraw(targetSourceStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetSourceStorage, {visualizePathStyle: {stroke: '#ffaa00'}})
                    }
                    break
                }

                const targetSourceContainer = roleUtils.findSourceContainers(creep)
                if (targetSourceContainer) {
                    creep.memory.target = targetSourceContainer[0].id
                    if(creep.withdraw(targetSourceContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetSourceContainer[0], {visualizePathStyle: {stroke: '#ffaa00'}})
                    }
                }

                break

            case STATE.Distributing:
                if (creep.memory.target) {
                    let target = Game.getObjectById(creep.memory.target)
                    if (target && target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                        creep.memory.target = null
                    } else {
                        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                        break
                    }
                }

                const spawn = Game.spawns[creep.memory.spawn]; 

                // go to spawn                
                if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.target = spawn.id
                    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffaa00'}})
                    }
                    break
                }

                // go to tower
                const towers = spawn.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => { 
                        return structure.structureType == STRUCTURE_TOWER; 
                    }
                })
                if (towers.length > 0) {
                    // find the tower with lowest energy charged
                    towers.sort((a, b) => b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY))
                    if (towers[0].store.getFreeCapacity(RESOURCE_ENERGY) > towers[0].store.getCapacity(RESOURCE_ENERGY) * 0.2) {
                        creep.memory.target = towers[0].id
                        if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                        break
                    }
                }

                // go to container
                const targetContainers = roleUtils.findControllerContainers(creep)
                if (targetContainers && targetContainers[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.target = targetContainers[0].id
                    if(creep.transfer(targetContainers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetContainers[0], {visualizePathStyle: {stroke: '#ffaa00'}})
                    }
                    break
                }

                break

            default:
        }
    },

}

module.exports = roleDistributor;