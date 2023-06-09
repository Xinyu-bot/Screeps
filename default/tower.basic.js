var towerBasic = {

    /**
     * 
     */
    run: function() {
        let towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
        towers.forEach(towerBasic._operate);
    },

    /**
     * @param {StructureTower} tower
     *  
     * Operate the tower
     */
    _operate: function(tower) {
        // check if this tower is active or if it has energy to operate
        if (!tower.isActive() || tower.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            return;
        }

        // find the closest hostile creep
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
            return;
        }

        // find the closest damaged structure
        target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax && structure.hits < 100000 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART;
            }
        });

        // find the closest damaged wall
        if (!target) {
            target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax && structure.hits < 10000 && structure.structureType == STRUCTURE_WALL;
                }
            });
        }

        // find the closest damaged rampart
        if (!target) {
            target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax && structure.hits < 10000 && structure.structureType == STRUCTURE_RAMPART;
                }
            });
        }

        // repair the target
        if (target) {
            tower.repair(target);
            return;
        }
    },

};

module.exports = towerBasic;