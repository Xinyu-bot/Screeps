const ROLE = require("./role.const");

const MinEnergyForSpawn = 200;
const ModuleCost = {
    [MOVE]: 50,
    [WORK]: 100,
    [CARRY]: 50,
    [ATTACK]: 80,
    [RANGED_ATTACK]: 150,
    [HEAL]: 250,
    [CLAIM]: 600,
    [TOUGH]: 10,
}

let spawnCommand = {
    
    /** 
     * @param {Map} screepsMap 
     *  
     * Loop through all spawns, and spawn creeps for each spawn 
     */
    spawn: function (screepsMap) {
        for (let spawnName in Game.spawns) {
            let spawn = Game.spawns[spawnName];
            if (spawn.spawning) continue;
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
        if (energy < MinEnergyForSpawn) return;
        
        let harvesters = screepsMap.get(ROLE.HARVESTER);
        let upgraders = screepsMap.get(ROLE.UPGRADER);
        let builders = screepsMap.get(ROLE.BUILDER);

        if (harvesters.length < 3) {
            spawnCommand._spawnHarvester(spawn);
        }
        else if (upgraders.length < 8) {
            spawnCommand._spawnUpgrader(spawn);            
        }
        else if (builders.length < 5) {
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
        let baseBody = [WORK, CARRY, MOVE];
        let baseCost = 0;
        baseBody.forEach((part) => baseCost += ModuleCost[part])
        let times = Math.floor(energy / baseCost);
        let body = [];
        for (let i = 0; i < times; i++) {
            body = body.concat(baseBody);
        }

        let _name = ROLE.HARVESTER + Game.time;
        let role = ROLE.HARVESTER;
        let memory = { 
            role: role,
            spawn: spawn.name,
        };

        if (body.length >= 3) {
            _name = spawn.spawnCreep(body, _name, { memory: memory });
        }
    },

    /**
     * @param {StructureSpawn} spawn 
     * 
     * Spawn upgrader
     */
    _spawnUpgrader: function (spawn) {
        let energy = spawn.room.energyAvailable;
        let baseBody = [WORK, CARRY, MOVE];
        let baseCost = 0;
        baseBody.forEach((part) => baseCost += ModuleCost[part])
        let times = Math.floor(energy / baseCost);
        let body = [];
        for (let i = 0; i < times; i++) {
            body = body.concat(baseBody);
        } 

        let _name = ROLE.UPGRADER + Game.time;
        let role = ROLE.UPGRADER;
        let memory = {
            role: role,
            spawn: spawn.name,
        };
        
        if (body.length >= 3) {
            _name = spawn.spawnCreep(body, _name, { memory: memory });
        }
    },

    /**
     * @param {StructureSpawn} spawn 
     * 
     * Spawn builder
     */
    _spawnBuilder: function (spawn) {
        let energy = spawn.room.energyAvailable;
        let baseBody = [WORK, CARRY, MOVE];
        let baseCost = 0;
        baseBody.forEach((part) => baseCost += ModuleCost[part])
        let times = Math.floor(energy / baseCost);
        let body = [];
        for (let i = 0; i < times; i++) {
            body = body.concat(baseBody);
        }

        let _name = ROLE.BUILDER + Game.time;
        let role = ROLE.BUILDER;
        let memory = {
            role: role,
            spawn: spawn.name,
        };

        if (body.length >= 3) {
            _name = spawn.spawnCreep(body, _name, { memory: memory });
        }
    },

};

module.exports = spawnCommand;