/*
	作用：非副本类的地图管理器,例如主城,野外等
*/

var LSServerConnecter = require("../Connection/LSServerConnecter");
var LSLog = require("../public/LSCommondHandle").LSLog;
var MSG = require("../Connection/LSMessageDef");
function LSWordServer(IP,PORT)
{
	var self = this;
	function init()
	{
		self.serverArray = new Array()
		self.clientArray = new Array();
		self.serverConnector = new LSServerConnecter(IP,PORT,self.gateWayOnConnected,self.gateWayOnClose);
		self.serverConnector.connection();//启动连接
	}
	//连接上了GateWay
	this.gateWayOnConnected = function(CONNECTOR) {
		LSLog("LSWordServer->gateWayOnConnected:");
		self.serverConnector.regisit(MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,this.onGateWayReplayInfo)
		var msg = {}
		msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
		msg.SERVER_NAME = "翡翠之城"
		msg.SERVER_STATE = 1;
		msg.SERVER_IP = "127.0.0.1";
		msg.SERVER_PORT = 1092;
		CONNECTOR.send(msg)
	}
	//与GateWay断开连接了
	this.gateWayOnClose = function(CONNECTOR) {
		LSLog("LSWordServer->gateWayOnClose:");
	}

	this.onGateWayReplayInfo = function(CONNECTOR,INFO)
	{
		LSLog("LSWordServer->onGateWayReplayInfo:",INFO.toString());
	}
	init();
}
LSWordServer(process.argv[2],process.argv[3]);