/*
*   作用:每当一个客户端连接进来的时候,对应的服务器上会有一个handler去持有这个客户端.
* */

module.exports = LSPlayerHandler;


LSCLIENT_STATE = {}
LSCLIENT_STATE.LSCLIENT_STATE_CLOSE  = 0;  //连接断开
LSCLIENT_STATE.LSCLIENT_STATE_CONNECTED = 1;//刚刚连接进来,不知道是谁
LSCLIENT_STATE.LSCLIENT_STATE_INIT = 2;  //正常情况了

module.exports.LSCLIENT_STATE = LSCLIENT_STATE;

var LSConnection = require("../Connection/LSConnection");
var LSCONNECTION_STATE = require("../Connection/LSConnection").LSCONNECTION_STATE;

function LSPlayerHandler(SOCKET,CLOSE_FUNC)
{
    LSConnection.call(this,SOCKET,CLOSE_FUNC)
    this.port = SOCKET.address().port;
    this.ip = SOCKET.remoteAddress;
    this.state = LSCONNECTION_STATE.LSCONNECTION_ON_INIT;
    this.clientState = LSCLIENT_STATE.LSCLIENT_STATE_CONNECTED;
}

LSPlayerHandler.prototype = new LSConnection();
LSPlayerHandler.prototype.getClientInfo = function()
{
    var info = {}
    info.CLIENT_IP = this.ip;
    info.CLIENT_PORT = this.port;
    info.CLIENT_STATE = this.clientState;
    return info;
}
