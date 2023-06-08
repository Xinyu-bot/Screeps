const ROLE = require("./role.const");
const roleUtils = require("./role.utils");

const STATE = {
	Sourcing: 1,
    Upgrading: 2,
}

let roleUpgrader = {

    /** 
     * 
     * @param {Creep} creep 
     * 
     */
    run: function(creep) {
        // check state
        roleUpgrader._state(creep);

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
	_state: function(creep) {
		switch (creep.memory.state) {
			case STATE.Sourcing:
				if (creep.store.getFreeCapacity() == 0) {
					creep.memory.state = STATE.Upgrading;
				}
				break;
			
			case STATE.Upgrading:
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
		if (Game.ticksToLive % 10) return;

        switch (creep.memory.state) {
            case STATE.Sourcing:
                creep.say(ROLE.SAY.SOURCE);
                break;

            case STATE.Upgrading:
                creep.say(ROLE.SAY.UPGRADE);
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

            case STATE.Upgrading:
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.signController(creep.room.controller, "From the void we came; into the void we shall return.");
                }
                break;

            default:

        }
    },

};

module.exports = roleUpgrader;