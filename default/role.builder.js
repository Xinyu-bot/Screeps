const ROLE = require("./role.const")
const roleUtils = require("./role.utils")

const STATE = {
	Sourcing: 1,
	Fixing: 2,
	Building: 3, 
}
const MinFixers = 1

let roleBuilder = {

    /** 
	 * @param {Creep} creep 
	 * */
    run: function(creep) {
		// check state
		roleBuilder._state(creep)

	    // operate
        roleBuilder._operate(creep)
    }, 

	/**
	 * @param {Creep} creep 
	 */ 
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
					// if we have less than 2 fixers, we should fix first
					let fixers = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.BUILDER && creep.memory.state == STATE.Fixing)
					
					let needFix = creep.room.find(FIND_STRUCTURES, {
						filter: object => object.hits < object.hitsMax
					}).length > 0
					
					let hasTower = creep.room.find(FIND_MY_STRUCTURES, {
						filter: object => {
							return object.structureType == STRUCTURE_TOWER && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0
						}
					}).length > 0
					
					creep.memory.state = (fixers.length < MinFixers && needFix && !hasTower) ? STATE.Fixing : STATE.Building 
					roleBuilder._say(creep); // shout to the GUI
				}
				break
			
			case STATE.Fixing:
				let needFix = creep.room.find(FIND_STRUCTURES, {
					filter: object => object.hits < object.hitsMax
				}).length > 0
				if (creep.store[RESOURCE_ENERGY] == 0 || !needFix) {
					creep.memory.target = null; // clear target
					creep.memory.state = STATE.Sourcing
					roleBuilder._say(creep); // shout to the GUI
				}

			case STATE.Building:
				if (creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.target = null; // clear target
					creep.memory.state = STATE.Sourcing
					roleBuilder._say(creep); // shout to the GUI
				}
				break

			// if we don't have a state, set it to Sourcing
			default:
				creep.memory.state = STATE.Sourcing
				roleBuilder._say(creep); // shout to the GUI
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

			case STATE.Building:
				creep.say(ROLE.SAY.BUILD)
				break

			case STATE.Fixing:
				creep.say(ROLE.SAY.FIX)
				break

			default:
				creep.say(ROLE.SAY.WONDER)
				break
		}  
    },

    /** 
	 * @param {Creep} creep 
	 */
    _operate: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				// source from container
				let containers = roleUtils.findSourceContainers(creep)
				if (containers) {
					containers.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)); // sort by used capacity in descending order, so we can find the one with the most used capacity
					if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}})
					}
					break
				}

				// source from source
				let source = roleUtils.findSource(creep)
				if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
				}
				break

			case STATE.Building:
				if (creep.memory.target) {
					let target = Game.getObjectById(creep.memory.target)
					// if the target is done, clear it
					if (target == null || target.progress == target.progressTotal) {
						creep.memory.target = null
					} else {
						if(creep.build(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
						}
						return
					}
				}

				let buildTarget = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)

				if(buildTarget) {
					creep.memory.target = buildTarget.id
					if(creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
						creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}})
					}
				}
				break

			case STATE.Fixing:
				if (creep.memory.target) {
					let target = Game.getObjectById(creep.memory.target)
					// if the target is done, clear it
					if (target == null || target.hits == target.hitsMax) {
						creep.memory.target = null
					} else {
						if(creep.repair(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target)
						}
						return
					}
				}

				let fixTargets = creep.room.find(FIND_STRUCTURES, {
					filter: object => object.hits < object.hitsMax
				})

				fixTargets.sort((a,b) => a.hits - b.hits)

				if(fixTargets.length > 0) {
					creep.memory.target = fixTargets[0].id
					if(creep.repair(fixTargets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(fixTargets[0])
					}
				}
				break

			default:
			}
    },

}

module.exports = roleBuilder;