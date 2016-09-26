/*
    作用:单独文件的测试单元
*/

var LSPlayer = require("./LSPlayer")

var player = new LSPlayer(100,200);

console.log("角色的类型ID为:",player.getTID(),"全局ID:",player.getGID())