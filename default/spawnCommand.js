const ROLE = require("./role.const");

let spawnCommand = {
    
    /** 
     * @param {Map} screepsMap 
     *  
     * Loop through all spawns, and spawn creeps for each spawn 
     */
    spawn: function (screepsMap) {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];
            spawnCommand._spawnCreep(spawn, screepsMap);
        }
    },

    /** 
     * @param {StructureSpawn} spawn
     * @param {Map} screepsMap
     *  
     * Spawn creeps for each spawn
     */
    _spawnCreep: function (spawn, screepsMap) {
        let energy = spawn.room.energyAvailable;
        if (energy < 300) return;
        
        let harvesters = screepsMap.get(ROLE.HARVESTER);
        let upgraders = screepsMap.get(ROLE.UPGRADER);
        let builders = screepsMap.get(ROLE.BUILDER);

        if (harvesters.length < 3) {
            spawnCommand._spawnHarvester(spawn);
        }
        else if (upgraders.length < 4) {
            spawnCommand._spawnUpgrader(spawn);            
        }
        else if (builders.length < 6) {
            spawnCommand._spawnBuilder(spawn);
        }
    },

    /**
     * @param {StructureSpawn} spawn 
     * 
     * Spawn harvester
     */
    _spawnHarvester: function (spawn) {
        let energy = spawn.room.energyAvailable;
        if (energy < 300) return;

        let _name = ROLE.HARVESTER + Game.time;
        let body = [WORK, CARRY, MOVE];
        let role = ROLE.HARVESTER;
        let memory = { 
            role: role,
            spawn: spawn.name,
        };

        _name = spawn.spawnCreep(body, _name, { memory: memory });
    },

    /**
     * @param {StructureSpawn} spawn 
     * 
     * Spawn upgrader
     */
    _spawnUpgrader: function (spawn) {
        let energy = spawn.room.energyAvailable;
        if (energy < 300) return;

        let _name = ROLE.UPGRADER + Game.time;
        let body = [WORK, CARRY, MOVE];
        let role = ROLE.UPGRADER;
        let memory = {
            role: role,
            spawn: spawn.name,
        };

        _name = spawn.spawnCreep(body, _name, { memory: memory });
    },

    /**
     * @param {StructureSpawn} spawn 
     * 
     * Spawn builder
     */
    _spawnBuilder: function (spawn) {
        let energy = spawn.room.energyAvailable;
        if (energy < 300) return;

        let _name = ROLE.BUILDER + Game.time;
        let body = [WORK, CARRY, MOVE];
        let role = ROLE.BUILDER;
        let memory = {
            role: role,
            spawn: spawn.name,
        };

        _name = spawn.spawnCreep(body, _name, { memory: memory });
    },

};

module.exports = spawnCommand;