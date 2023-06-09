const ROLE = require("./role.const")
const roleUtils = require("./role.utils")

const STATE = {
	Sourcing: 1,
    Upgrading: 2,
}

let roleUpgrader = {

    /** 
     * @param {Creep} creep 
     */
    run: function(creep) {
        // check state
        roleUpgrader._state(creep)

	    // operate
        roleUpgrader._operate(creep)
    }, 

	/**
	 * @param {Creep} creep 
	 */ 
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
					creep.memory.state = STATE.Upgrading
                    roleUpgrader._say(creep); // shout to the GUI
				}
				break
			
			case STATE.Upgrading:
				if (creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.state = STATE.Sourcing
                    roleUpgrader._say(creep); // shout to the GUI
				}
				break

			// if we don't have a state, set it to Sourcing
			default:
				creep.memory.state = STATE.Sourcing
                roleUpgrader._say(creep); // shout to the GUI
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

            case STATE.Upgrading:
                creep.say(ROLE.SAY.UPGRADE)
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
                let containers = roleUtils.findControllerContainers(creep)
                if (containers) {
                    containers.sort((a, b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY))
                    if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffffff'}})
                    }
                    break
                }

                let source = roleUtils.findSource(creep)
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})
                }
                break

            case STATE.Upgrading:
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}})
                } else {
                    creep.signController(creep.room.controller, "From the void we came; into the void we shall return.")
                }
                break

            default:

        }
    },

}

module.exports = roleUpgrader;