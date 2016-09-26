/*
    作用:游戏中所有物品的父类
 */
module.exports = LSGameObject;

function LSGameObject(TID,GID)
{
    this.typeID = TID;
    this.guid = GID;
}
LSGameObject.prototype.getTID = function()
{
    return this.typeID;
}
LSGameObject.prototype.getGID = function()
{
    return this.guid;
}
