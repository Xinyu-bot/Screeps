const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

const STATE = {
	Sourcing: 1,
	Fixing: 2,
	Building: 3, 
}
const MinFixers = 1;

let roleBuilder = {

    /** 
	 * 
	 * @param {Creep} creep 
	 * 
	 * */
    run: function(creep) {
		// check state
		roleBuilder._state(creep);

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
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
					// if we have less than 2 fixers, we should fix first
					let fixers = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.BUILDER && creep.memory.state == STATE.Fixing);
					creep.memory.state = fixers.length < MinFixers ? STATE.Fixing : STATE.Building;
				}
				break;
			
			case STATE.Building, STATE.Fixing:
				if (creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.target = null; // clear target
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
				creep.say(ROLE.SAY.SOURCE);
				break;

			case STATE.Building:
				creep.say(ROLE.SAY.BUILD);
				break;

			case STATE.Fixing:
				creep.say(ROLE.SAY.FIX);
				break;

			default:
				creep.say(ROLE.SAY.WONDER);
				break;
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

			case STATE.Building:
				if (creep.memory.target) {
					let target = Game.getObjectById(creep.memory.target);
					// if the target is done, clear it
					if (target == null || target.progress == target.progressTotal) {
						creep.memory.target = null;
					} else {
						if(creep.build(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
						}
						return;
					}
				}

				let buildTarget = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

				if(buildTarget) {
					creep.memory.target = buildTarget.id;
					if(creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
						creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				}
				break;

			case STATE.Fixing:
				if (creep.memory.target) {
					let target = Game.getObjectById(creep.memory.target);
					// if the target is done, clear it
					if (target == null || target.hits == target.hitsMax) {
						creep.memory.target = null;
					} else {
						if(creep.repair(target) == ERR_NOT_IN_RANGE) {
							creep.moveTo(target);
						}
						return;
					}
				}

				let fixTargets = creep.room.find(FIND_STRUCTURES, {
					filter: object => object.hits < object.hitsMax
				});

				fixTargets.sort((a,b) => a.hits - b.hits);

				if(fixTargets.length > 0) {
					creep.memory.target = fixTargets[0].id;
					if(creep.repair(fixTargets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(fixTargets[0]);
					}
				}
				break;

			default:
			}
    },

};

module.exports = roleBuilder;