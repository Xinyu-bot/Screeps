var { SourceMap } = require('./role.prepare');


let roleUtils = {

    /** 
	 * @param {Creep} creep 
	 * @returns {Source}
	 */
    findSource: function(creep) {
        // if we already have a source, use it
        if (creep.memory.sourceId != null && creep.memory.sourceId != undefined) {
            return Game.getObjectById(creep.memory.sourceId);
        }

        let sources = creep.room.find(FIND_SOURCES);
        let sourcesMap = SourceMap

        let sourceId = "";
        // if we have more than one source, we may need to pick one
        if (sources.length > 1) {
            
            // fix the map
            if (sourcesMap.size != sources.length) {
                if (sourcesMap.has(sources[0].id)) {
                    sourcesMap.set(sources[1].id, 0);
                } else {
                    sourcesMap.set(sources[0].id, 0);
                }
            }

            // pick the source with the least number of harvesters
            let source_0 = sourcesMap.get(sources[0].id) ? sourcesMap.get(sources[0].id) : 0;
            let source_1 = sourcesMap.get(sources[1].id) ? sourcesMap.get(sources[1].id) : 0;
            if (source_0 <= source_1) {
                sourceId = sources[0].id;
                sourcesMap.set(sourceId, source_0 + 1);
            } else {
                sourceId = sources[1].id;
                sourcesMap.set(sourceId, source_1 + 1);
            }

            // update the map
            creep.memory.sourceId = sourceId;

        } else {
            // if we only have one source, use it directly
            sourceId = sources[0].id;
            sourcesMap.set(sourceId, sourcesMap.get(sourceId) + 1);
        }

        SourceMap = sourcesMap;
        return Game.getObjectById(sourceId);
    },

    /**
     * @param {Creep} creep
     * @returns {StructureSpawn}
     *  
     * Find the containers near the sources
     */
    findSourceContainer: function(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                let source_0 = structure.pos.inRangeTo(sources[0], 3);
                let source_1 = sources.length > 1 ? structure.pos.inRangeTo(sources[1], 3) : true; // if we only have one source, we don't need to check the second one
                return structure.structureType == STRUCTURE_CONTAINER && (source_0 || source_1);
            }
        });

        // sort by used capacity in descending order, so we can find the one with the most used capacity
        containers.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)); 

        if (containers.length > 0) {
            return containers[0];
        } else {
            return null;
        }
    },


    /**
     * @param {Creep} creep
     * @returns {StructureSpawn}
     *  
     * Find the containers near the controllers
     */
    findControllerContainer: function(creep) {
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(creep.room.controller, 3) && structure.store.getFreeCapacity() > 0;
            }
        });

        // sort by free capacity in descending order, so we can find the one with the most free capacity
        containers.sort((a, b) => b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY)); 

        if (containers.length > 0) {
            return containers[0];
        } else {
            return null;
        }
    },

};

module.exports = roleUtils;