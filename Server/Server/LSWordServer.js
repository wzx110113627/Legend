/*
	作用：非副本类的地图管理器,例如主城,野外等
*/

var LSServerConnecter = require("../Connection/LSServerConnecter");
var LSPlayerMaker = require("../Manager/LSPlayerMaker");
var LSLog = require("../public/LSCommondHandle").LSLog;
var MSG = require("../Connection/LSMessageDef");
require("../public/LSHelper");

function LSWordServer(IP,PORT,SERVER_ID)
{
	var self = this;
	function init()
	{
		self.serverID = SERVER_ID;
		self.serverArray = new Array()
		self.clientArray = new Array();
		self.serverConnector = new LSServerConnecter(IP,PORT,self.gateWayOnConnected,self.gateWayOnClose);
		self.serverConnector.connection();//启动连接
	}
	//连接上了GateWay
	this.gateWayOnConnected = function(CONNECTOR) {
		LSLog("LSWordServer->gateWayOnConnected:");
		self.serverConnector.regisit(MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,this.onGateWayReplayInfo)
		self.playerMaker = new LSPlayerMaker(
			self.playerMakerStartOn,
			self.newClientComein,
			self.clientDisConnect,
			0
		)
		self.playerMaker.startListen();
	}
	//与GateWay断开连接了
	this.gateWayOnClose = function(CONNECTOR) {
		LSLog("LSWordServer->gateWayOnClose:");
	}

	this.onGateWayReplayInfo = function(CONNECTOR,INFO)
	{
		LSLog("LSWordServer->onGateWayReplayInfo:",INFO.toString());
	}


	//所有客户端的操作
	this.playerMakerStartOn = function (IP,PORT) {
		self.clentIP = IP; //客户端连接的IP
		self.clentPort = PORT;//客户端连接的端口
		console.log("self.clentIP :"+IP + " self.clentPort:" + PORT)
		var msg = {}
		msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
		msg.SERVER_NAME = "翡翠之城"
		msg.SERVER_ID = self.serverID;
		msg.SERVER_STATE = 1;
		msg.SERVER_IP = self.clentIP;
		msg.SERVER_PORT = self.clentPort;
		self.serverConnector.send(msg)
		LSLog("LSGateWay->playerMakerStartOn:"+IP + " port:"+PORT)
	}
	this.newClientComein = function(Client)
	{
		if(Client)
		{
			Client.setState(LSCONNECTION_STATE.LSCONNECTION_ON_CONNECTTING);
			self.clientArray.push(Client)
			LSLog("LSGateWay->newClientComein,当前数量为:"+self.newClientComein.length);
			Client.regisit(MSG.MSG_GATEWAY_PLAY_WITH_ROLE,self.clientPlayWithRole)
		}
	}
	//服务器状态发生改变的时候.Info里面有服务器的名称,状态,类型等信息
	this.clientDisConnect = function (Client,Info)
	{
		if(Client)
		{
			if(this.clientArray.remove(Client))
			{
				LSLog("LSGateWay->clientDisConnect: 客户端:"+Client.ip+" 关闭"+ ",剩余连接客户端数量为:"+self.clientArray.length);
			}else{
				LSLog("LSGateWay->clientDisConnect: 客户端:"+Client.ip+" 关闭失败,没有找到这个客户端"+ ",剩余连接客户端数量为:"+self.clientArray.length);
			}
		}
	}


	init();
}
LSWordServer(process.argv[2],process.argv[3],process.argv[4]);