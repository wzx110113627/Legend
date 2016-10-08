/*
	作用:各个游戏服务器的网关,启动之后会主动联系ServerList服务器
*/

var LSServerConnecter = require("../Connection/LSServerConnecter");
var LSLog = require("../public/LSCommondHandle").LSLog;
var MSG = require("../Connection/LSMessageDef");
function LSGateWay(IP,PORT)
{
	var self = this;
	function init()
	{
		self.serverArray = new Array()
		self.clientArray = new Array();

		self.serverConnector = new LSServerConnecter(IP,PORT,self.serverListOnConnected,self.serverListOnClose);
		self.serverConnector.connection();//启动连接
	}

	//连接上了serverList
	this.serverListOnConnected = function(CONNECTOR) {
		LSLog("LSGateWay->serverListOnConnected:");
		self.serverConnector.regisit(MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,this.onServerListReplayInfo)
		var msg = {}
		msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
		msg.SERVER_NAME = "雄霸天下"
		msg.SERVER_STATE = 1;
		msg.SERVER_IP = "127.0.0.1";
		msg.SERVER_PORT = 1092;
		CONNECTOR.send(msg)
	}
	//和Serveriset连接断开
	this.serverListOnClose = function(CONNECTOR) {
		LSLog("LSGateWay->serverListOnClose:");
	}

	this.onServerListReplayInfo = function(CONNECTOR,INFO)
	{
		LSLog("LSGateWay->onServerListReplayInfo:",INFO);
	}
	init();
}


console.log(process.argv[2],process.argv[3]);
LSGateWay(process.argv[2],process.argv[3]);





