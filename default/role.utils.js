var { SourceMap } = require('./role.prepare');


let roleUtils = {

    /** 
	 * 
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
            // pick the source with the least number of harvesters
            if (sourcesMap.get(sources[0].id) < sourcesMap.get(sources[1].id)) {
                sourceId = sources[0].id;
            } else {
                sourceId = sources[1].id;
            }

            // update the map
            sourcesMap.set(sourceId, sourcesMap.get(sourceId) + 1);
            creep.memory.sourceId = sourceId;
        } else {
            // if we only have one source, use it directly
            sourceId = sources[0].id;
            sourcesMap.set(sourceId, sourcesMap.get(sourceId) + 1);
        }

        SourceMap = sourcesMap;
        return Game.getObjectById(sourceId);
    },

};

module.exports = roleUtils;