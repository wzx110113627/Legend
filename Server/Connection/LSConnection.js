/*
*   作用:用于等待连接的实体对象.
* */

module.exports = LSConnection;
var MsgOperator = require("../Connection/LSMessageOpeator").LSMessageOpeator;
var LSLog = require("../public/LSCommondHandle").LSLog;

LSCONNECTION_STATE = {}
LSCONNECTION_STATE.LSCONNECTION_ON_INIT = 0;//刚刚连接,没有任何数据过来.
LSCONNECTION_STATE.LSCONNECTION_ON_CONNECTTING = 1;//连接状态
LSCONNECTION_STATE.LSCONNECTION_ON_CLOSE = 2;//被动断开
LSCONNECTION_STATE.LSCONNECTION_ON_FORCE_CLOSE = 3;//强制断开
module.exports.LSCONNECTION_STATE = LSCONNECTION_STATE;

function LSConnection(SOCKET,CLOSE_FUNC)
{
    var self = this;
    this.seprater = String.fromCharCode(1);
    this.socket = SOCKET;
    this.state = LSCONNECTION_STATE.LSCONNECTION_ON_CONNECTTING;
    this.msgOperator = new MsgOperator()
    this.msgOperator.setTarget(this);
    if(SOCKET)
    {
        SOCKET.on('data',function(data){
            self.msgOperator.onData(data)
        });
        SOCKET.on('error',function(exception){
            LSLog('socket error:' + exception);
            if(self.state != LSCONNECTION_STATE.LSCONNECTION_ON_FORCE_CLOSE)
            {
                self.state = LSCONNECTION_STATE.LSCONNECTION_ON_CLOSE;
            }
            self.socket.end();
            self.msgOperator.clean();
        });
        //客户端关闭事件
        SOCKET.on('close',function(data){
            if(self.state != LSCONNECTION_STATE.LSCONNECTION_ON_FORCE_CLOSE)
            {
                self.state = LSCONNECTION_STATE.LSCONNECTION_ON_CLOSE;
            }
            self.msgOperator.clean();
            CLOSE_FUNC(self,data)
        });
    }

}
//设置状态
LSConnection.prototype.setState = function (STATE) {
    if(STATE>=LSCONNECTION_STATE.LSCONNECTION_ON_INIT && STATE<=LSCONNECTION_STATE.LSCONNECTION_ON_FORCE_CLOSE)
    {
        this.state =  STATE;
    }
}
//获取状态
LSConnection.prototype.getState = function () {
    return this.state;
}

//强制关闭连接
LSConnection.prototype.close = function () {
    if(this.state != LSCONNECTION_STATE.LSCONNECTION_ON_CLOSE)
    {
        this.state = LSCONNECTION_STATE.LSCONNECTION_ON_FORCE_CLOSE;
    }
    this.socket.end();
}

//发送数据
LSConnection.prototype.send = function (MSG) {
    if(this.state != LSCONNECTION_STATE.LSCONNECTION_ON_CONNECTTING)
    {
        LSLog("LSConnection.send:"+"连接已经断开,不能发送消息,状态为:"+this.state);
        return;
    }
    if(MSG)
    {
        var sendText = JSON.stringify(MSG) + this.seprater;
        this.socket.write(sendText);
    }else{
        LSLog("LSConnection.send:发送错误消息:"+MSG);
    }
}
//注册消息回调函数
LSConnection.prototype.regisit = function (ID,CALLBACK) {
    this.msgOperator.regisit(ID,CALLBACK);
}
