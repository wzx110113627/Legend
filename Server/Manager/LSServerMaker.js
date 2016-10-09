/*
*  作用:产生一个等待服务器连接的服务器.他只用户服务器之间的通信.
* */

var LSServerHandler = require("../Connection/LSServerHandler");
var LSLog = require("../public/LSCommondHandle").LSLog;
var net = require('net')
var LSGetIP = require("../public/LSCommondHandle").LSGetIP;

module.exports = LSServerMaker;

/*
*   参数1:服务器启动之后的通知.
*   参数2:新服务器进入时候,用于通知的函数
*   参数3:服务器关闭用户通知的函数
*   参数4:启动的端口号
* */
function LSServerMaker(START_FUNC,NEW_FUNC,CLOSE_FUNC,PORT)
{
    this.startListen = function()
    {
        var server = net.createServer(function(socket){
            socket.setEncoding('utf-8');
            var newServer = new LSServerHandler(socket,CLOSE_FUNC);
            NEW_FUNC(newServer)
        }).listen(PORT);

        server.on('listening',function(){
            START_FUNC(LSGetIP(),server.address().port);
        });
        server.on("error",function(exception){
            LSLog("LSServerClientConnection error:" + exception);
        });
    }
}