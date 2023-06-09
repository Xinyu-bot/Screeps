var rolePrepare = {

    SourceMap: new Map(),
    OutHarvestFlagRegistry: new Map(),

    /** 
     * @param {} creeps
     */
    prepare: function(creeps) {
        rolePrepare._prepareSourceMap(creeps)
        rolePrepare._prepareOutHarvestFlagRegistry()
    }, 

    /**
     * @param {} creeps
     */
    _prepareSourceMap: function(creeps) {
        for (let key of this.SourceMap.keys()) {
            this.SourceMap.set(key, 0)
        }
        
        for (let name in creeps) {
            let creep = Game.creeps[name]
            let sourceId = creep.memory.sourceId
            if (sourceId == null || sourceId == undefined) return
            if (this.SourceMap.has(sourceId)) {
                this.SourceMap.set(sourceId, this.SourceMap.get(sourceId) + 1)
            } else {
                this.SourceMap.set(sourceId, 1)
            }
        }
    },

    _prepareOutHarvestFlagRegistry: function() {
        if (this.OutHarvestFlagRegistry) {
            this.OutHarvestFlagRegistry.clear()
        }
    },

}

module.exports = rolePrepare;