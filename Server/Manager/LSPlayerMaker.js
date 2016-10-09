/*
*   作用:启动等待客户端连接的服务
* */

var LSPlayerHandler = require("../Connection/LSPlayerHandler");
var LSLog = require("../public/LSCommondHandle").LSLog;
var net = require('net')
var LSGetIP = require("../public/LSCommondHandle").LSGetIP;

module.exports = LSServerMaker;

/*
 *   参数1:服务器启动之后的通知.
 *   参数2:新客户端进入时候,用于通知的函数
 *   参数3:客户端离线通知的函数
 *   参数4:启动的端口号
 * */
function LSPlayerMaker(START_FUNC,NEW_FUNC,CLOSE_FUNC,PORT)
{
    this.startListen = function()
    {
        var player = net.createServer(function(socket){
            socket.setEncoding('utf-8');
            //TODO:这里可以做非法验证.被封IP不然连接等.
            var newPlayer = new LSPlayerHandler(socket,CLOSE_FUNC);
            NEW_FUNC(newServer)
        }).listen(PORT);

        player.on('listening',function(){
            START_FUNC(LSGetIP(),server.address().port);
        });
        player.on("error",function(exception){
            LSLog("LSPlayerMaker->error:" + exception);
        });
    }
}