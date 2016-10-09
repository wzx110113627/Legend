/*
*   作用:服务器之间连接使用.被连接的服务器,每一次被一个新服务器连接的时候,就会产生一个对象,用于表示一个连接
* */


module.exports = LSServerHandler;
LSSERVER_STATE = {}
LSSERVER_STATE.LSSERVER_STATE_CLOSE  = 0;  //关闭
LSSERVER_STATE.LSSERVER_STATE_REPAIR = 1;  //维护
LSSERVER_STATE.LSSERVER_STATE_NORMAL = 2;  //普通
LSSERVER_STATE.LSSERVER_STATE_BUSY   = 3;  //繁忙
LSSERVER_STATE.LSSERVER_STATE_FULL   = 4;  //满员

module.exports.LSSERVER_STATE = LSSERVER_STATE;

var LSConnection = require("../Connection/LSConnection");
var LSCONNECTION_STATE = require("../Connection/LSConnection").LSCONNECTION_STATE;
var LSLog = require("../public/LSCommondHandle").LSLog;

function LSServerHandler(SOCKET,CLOSE_FUNC)
{
    LSLog("LSServerHandler->init:"+SOCKET)
    LSConnection.call(this,SOCKET,CLOSE_FUNC)
    this.port = SOCKET.address().port;
    this.ip = SOCKET.remoteAddress;
    this.name = "未定义"
    this.serverState = LSSERVER_STATE.LSSERVER_STATE_CLOSE;
    this.state = LSCONNECTION_STATE.LSCONNECTION_ON_INIT;
}
LSServerHandler.prototype = new LSConnection();
LSServerHandler.prototype.getServerInfo = function()
{
    var info = {}
    info.SERVER_IP = this.ip;
    info.SERVER_PORT = this.port;
    info.SERVER_NAME = this.name;
    info.SERVER_STATE = this.serverState;
    return info;
}
LSServerHandler.prototype.setServerState = function(state)
{
    if(state>=LSSERVER_STATE.LSSERVER_STATE_CLOSE && state <=LSSERVER_STATE.LSSERVER_STATE_FULL)
    {
        this.state = state;
    }
}

LSServerHandler.prototype.getServerState = function()
{
    return this.serverState;
}

LSServerHandler.prototype.setServerName = function(NAME)
{
    this.name = NAME;
}

LSServerHandler.prototype.getServerName = function()
{
    return this.name;
}
