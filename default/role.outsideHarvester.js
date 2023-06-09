const ROLE = require("./role.const")
const roleUtils = require("./role.utils")

const STATE = {
	Sourcing: 1,
    Delivering: 2,
}


var roleOutsideHarvester = {

    /**
     * @param {Creep} creep
     */
    run: function(creep) {
        // check state
        roleOutsideHarvester._state(creep)

        // operate
        roleOutsideHarvester._operate(creep)
    },

    /**
     * @param {Creep} creep
    */
    _state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
					creep.memory.state = STATE.Delivering
                    roleOutsideHarvester._say(creep);  // shout to the GUI
				}
				break
			
			case STATE.Delivering:
				if (creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.state = STATE.Sourcing
                    roleOutsideHarvester._say(creep);  // shout to the GUI
				}
				break

			// if we don't have a state, set it to Sourcing
			default:
				creep.memory.state = STATE.Sourcing
                roleOutsideHarvester._say(creep);  // shout to the GUI
		}
    },

    /**
     * @param {Creep} creep
    */
    _say: function(creep) {
        switch (creep.memory.state) {
            case STATE.Sourcing:
                creep.say(ROLE.SAY.HARVEST)
                break

            case STATE.Delivering:
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
            case STATE.Sourcing:
                if (creep.memory.target) {
                    // we store the flag name instead of a id
                    let target = Game.flags[creep.memory.target]

                    if (target) {
                        let position = new RoomPosition(target.pos.x, target.pos.y, target.pos.roomName)
                        // if current position is not in range of 1, move to the flag
                        if (creep.pos.inRangeTo(position, 1) == false) {
                            creep.moveTo(position, {visualizePathStyle: {stroke: '#ffaa00'}})
                        } else {
                            // find the source target and harvest
                            let sources = creep.room.find(FIND_SOURCES);
                            for (let source of sources) {
                                if (source.pos.inRangeTo(position, 0)) {
                                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
                                    }
                                    break;
                                }
                            }

                        }
                    } else {
                        creep.memory.target = null
                    }
                    break
                }

                let flags = Game.flags
                for (let flagName in flags) {
                    let flag = flags[flagName]
                    // if the flag is yellow and has a yellow secondary color, it's a source flag for outside harvesters
                    if (flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_YELLOW) {
                        creep.memory.target = flag.name
                        let position = new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName)
                        if (creep.harvest(position) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(position, {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                        break
                    }
                }

                break

            case STATE.Delivering:
                if (creep.memory.target) {
                    let target = Game.getObjectById(creep.memory.target)
                    if (target) {
                        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
                        }
                    } else {
                        creep.memory.target = null
                    }
                    break
                }

                let spawn = Game.spawns[creep.memory.spawn]
                
                // find the storage
                let storage = spawn.room.storage
                if (storage && storage.store.getFreeCapacity() > 0) {
                    creep.memory.target = storage.id
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                    break
                }

                // find the spawn
                if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    creep.memory.target = spawn.id
                    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                    break
                }

                // find the container
                let containers = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    }
                })
                if (containers.length > 0) {
                    creep.memory.target = containers[0].id
                    if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                    break
                }
                
                break
            
            default:
        }
    },

    /**
     * @param {Creep} creep
     * @returns {Source}
     */ 
    _findSource: function(creep) {

    },

}

module.exports = roleOutsideHarvester;