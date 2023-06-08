var rolePrepare = {

    SourceMap: new Map(),

    /** 
     * 
     * @param {} creeps
     * 
     * 
     */
    prepare: function(creeps) {
        rolePrepare._prepareSourceMap(creeps);
    }, 

    /**
     * 
     * @ param {} creeps
     * 
     */
    _prepareSourceMap: function(creeps) {
        if (this.SourceMap.size > 0) this.SourceMap.clear();
        
        for (let name in creeps) {
            let creep = Game.creeps[name];
            let sourceId = creep.memory.sourceId;
            if (sourceId == null || sourceId == undefined) return;
            if (this.SourceMap.has(sourceId)) {
                this.SourceMap.set(sourceId, this.SourceMap.get(sourceId) + 1);
            } else {
                this.SourceMap.set(sourceId, 1);
            }
        }
    }

};

module.exports = rolePrepare;