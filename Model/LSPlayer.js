/*
    作用: 玩家的对象模型,主要负责玩家的自身的所有逻辑功能
*/
var LSGameObject = require("../Model/LSGameObject")
var util = require("util")
module.exports = LSPlayer;

function LSPlayer(TID,GID) {
    LSGameObject.call(this,TID,GID)
}
LSPlayer.prototype = new LSGameObject();
