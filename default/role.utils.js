var { SourceMap } = require('./role.prepare');


let roleUtils = {

    /** 
	 * @param {Creep} creep 
	 * @returns {Source}
	 */
    findSource: function(creep) {
        // if we already have a source, use it
        if (creep.memory.sourceId != null && creep.memory.sourceId != undefined) {
            // check if the source still has energy, if yes, use it
            let source = Game.getObjectById(creep.memory.sourceId);
            if (source.energy > 0) {
                return source;
            }

            // check if need rebalance the source map
            if (SourceMap.size > 1) {
                let currentSourceId = creep.memory.sourceId;
                let _this, _that = 0;
                let _thisKey, _thatKey = "";
                for (let key of SourceMap.keys()) {
                    if (key == currentSourceId) {
                        _this = SourceMap.get(key);
                        _thisKey = key;
                    } else {
                        _that = SourceMap.get(key);
                        _thatKey = key;
                    }
                }
                if (_this > _that) {
                    SourceMap.set(currentSourceId, _this - 1);
                    SourceMap.set(_thatKey, _that + 1);
                    creep.memory.sourceId = _thatKey;
                }
            }

            return Game.getObjectById(creep.memory.sourceId);
        }

        let sources = creep.room.find(FIND_SOURCES);
        let sourcesMap = SourceMap

        let sourceId = "";
        // if we have more than one source, we may need to pick one
        if (sources.length > 1) {

            // fix the map
            if (sourcesMap.size != sources.length) {
                if (!sourcesMap.has(sources[0].id)) {
                    sourcesMap.set(sources[0].id, 0);
                } 
                if (!sourcesMap.has(sources[1].id)) {
                    sourcesMap.set(sources[1].id, 0);
                }
            }

            // pick the source with the least number of harvesters
            let source_0 = sourcesMap.has(sources[0].id) ? sourcesMap.get(sources[0].id) : 0;
            let source_1 = sourcesMap.has(sources[1].id) ? sourcesMap.get(sources[1].id) : 0;
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
    findSourceContainers: function(creep) {
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
            return containers;
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
    findControllerContainers: function(creep) {
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(creep.room.controller, 3);
            }
        });

        // sort by free capacity in descending order, so we can find the one with the most free capacity
        containers.sort((a, b) => b.store.getFreeCapacity(RESOURCE_ENERGY) - a.store.getFreeCapacity(RESOURCE_ENERGY)); 

        if (containers.length > 0) {
            return containers;
        } else {
            return null;
        }
    },

};

module.exports = roleUtils;