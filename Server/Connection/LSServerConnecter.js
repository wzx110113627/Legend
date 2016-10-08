/*
*  作用:服务器之间通信时候,作为客户端的连接器
*
* */

var net = require('net')
var MsgOperator = require("../Connection/LSMessageOpeator").LSMessageOpeator;
var LSLog = require("../public/LSCommondHandle").LSLog;

module.exports = LSServerConnecter;

var LSCONNECTER_STATE = {}
LSCONNECTER_STATE.LSCONNECTER_STATE_INIT = 0;
LSCONNECTER_STATE.LSCONNECTER_STATE_CONNECTED = 1;
LSCONNECTER_STATE.LSCONNECTER_STATE_CLOSE = 2;

module.exports.LSCONNECTER_STATE = LSCONNECTER_STATE;

function LSServerConnecter(IP,PORT,CONNECTED_FUNC,CLOSE_FUNC)
{
    var client  = new net.Socket();
    var seprater = String.fromCharCode(1);
    client.setEncoding('utf-8');
    this.state = LSCONNECTER_STATE.LSCONNECTER_STATE_INIT;
    this.msgOperator = new MsgOperator();
    this.msgOperator.setTarget(this);
    this.socket = client;
    var self = this;
    this.connection = function()
    {
        client.connect(PORT,IP,function(){
            self.state = LSCONNECTER_STATE.LSCONNECTER_STATE_CONNECTED;
            CONNECTED_FUNC(self);
        });
        client.on('data', function (data) {
            self.msgOperator.onData(data);
        });
        client.on('error', function (error) {
            LSLog("LSServerConnecter:"+error)
            self.state = LSCONNECTER_STATE.LSCONNECTER_STATE_CLOSE;
            CLOSE_FUNC(self)
            self.msgOperator.clean();
        });
        client.on('close', function (data) {
            self.state = LSCONNECTER_STATE.LSCONNECTER_STATE_CLOSE;
            CLOSE_FUNC(self)
            self.msgOperator.clean();
        });
    }
    this.closeConnection = function()
    {
        self.state = LSCONNECTER_STATE.LSCONNECTER_STATE_CLOSE;
        self.socket.end();
    }

    this.regisit = function (ID,CALLBACK) {
        self.msgOperator.regisit(ID,CALLBACK);
    }
    this.send = function (MSG) {
        if(self.state != LSCONNECTER_STATE.LSCONNECTER_STATE_CONNECTED)
        {
            LSLog("LSServerConnecter->send:"+"连接已经断开,不能发送消息,状态为:"+self.state);
            return;
        }
        if(MSG)
        {
            var sendText = JSON.stringify(MSG) + seprater;
            self.socket.write(sendText);
        }else{
            LSLog("LSServerConnecter->send:发送错误消息:"+MSG);
        }
    }
}