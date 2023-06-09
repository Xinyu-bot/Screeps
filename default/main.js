const _ = require('lodash');

const clearMemory = require('clearMemory');

const towerBasic = require('tower.basic');

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const rolePrepare = require('role.prepare');
const roleCarrier = require('role.carrier');
const ROLE = require('./role.const');

const spawnCommand = require('spawn.command');


module.exports.loop = function () {
    // clear memory
    clearMemory.run();

    // tower
    towerBasic.run();

    // prepare
    rolePrepare.prepare(Game.creeps);

    // creep operation
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.HARVESTER);
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.UPGRADER);
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.BUILDER);
    let carriers = _.filter(Game.creeps, (creep) => creep.memory.role == ROLE.CARRIER);
    
    harvesters.forEach(roleHarvester.run);
    upgraders.forEach(roleUpgrader.run);
    builders.forEach(roleBuilder.run);
    carriers.forEach(roleCarrier.run);

    // spawn operation
    let map = new Map();
    map.set(ROLE.HARVESTER, harvesters);
    map.set(ROLE.UPGRADER, upgraders);
    map.set(ROLE.BUILDER, builders);
    map.set(ROLE.CARRIER, carriers);
    spawnCommand.spawn(map);
    
}


