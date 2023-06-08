const _ = require('lodash');

const clearMemory = require('clearMemory');

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const rolePrepare = require('role.prepare');
const ROLE = require('./role.const');
let { SourceMap } = require('./role.prepare');

const spawnCommand = require('spawnCommand');


module.exports.loop = function () {
    // clear memory
    clearMemory.run();

    // prepare
    rolePrepare.prepare(Game.creeps);

    // creep operation
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.HARVESTER);
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.UPGRADER);
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.BUILDER);
    
    harvesters.forEach(roleHarvester.run);
    upgraders.forEach(roleUpgrader.run);
    builders.forEach(roleBuilder.run);

    // spawn operation
    let map = new Map();
    map.set(ROLE.HARVESTER, harvesters);
    map.set(ROLE.UPGRADER, upgraders);
    map.set(ROLE.BUILDER, builders);
    spawnCommand.spawn(map);

    SourceMap.forEach(
        (value, key) => console.log(key + " " + value)
    );
}


