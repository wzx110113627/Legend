/*
	作用:各个游戏服务器的网关,启动之后会主动联系ServerList服务器
	启动顺序:启动之后先连接 ServerList->启动服务器连接服务->启动客户端连接服务器
*/

var LSServerConnecter = require("../Connection/LSServerConnecter");
var LSLog = require("../public/LSCommondHandle").LSLog;
var MSG = require("../Connection/LSMessageDef");
var LSServerMaker = require("../Manager/LSServerMaker");
require("../public/LSHelper");

function LSGateWay(IP,PORT)
{
	var self = this;
	function init()
	{
		self.serverArray = new Array()
		self.clientArray = new Array();
		self.serverConnector = new LSServerConnecter(IP,PORT,self.serverListOnConnected,self.serverListOnClose);
		self.serverConnector.connection();//启动连接,连接serverList
	}
	//连接上了serverList
	this.serverListOnConnected = function(CONNECTOR) {
		LSLog("LSGateWay->serverListOnConnected:");
		self.serverConnector.regisit(MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,this.onServerListReplayInfo)
		//和ServerList建立连接之后再启动自己的服务.
		//启动自己的服务器服务,等待其他服务器的加入.例如场景服务器等
		self.serverMaker = new LSServerMaker(self.serverStartOn,
			self.newServerComein,
			self.newServerDisConnect,
			0//等待服务器的入口动态分布.
		);
		self.serverMaker.startListen();
	}
	//和Serveriset连接断开
	this.serverListOnClose = function(CONNECTOR) {
		LSLog("LSGateWay->serverListOnClose:");
	}

	this.onServerListReplayInfo = function(CONNECTOR,INFO)
	{
		LSLog("LSGateWay->onServerListReplayInfo:",INFO);
	}

	//等待其他服务器的加入
	//开始等待其他服务器的加入.
	this.serverStartOn = function(IP,PORT)
	{
		self.serverIP = IP; //给服务器连接的IP 和 PORT
		self.serverPort = PORT;

		var msg = {}
		msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
		msg.SERVER_NAME = "雄霸天下"
		msg.SERVER_STATE = 1;
		msg.SERVER_IP = self.serverIP;
		msg.SERVER_PORT = self.serverPort;
		self.serverConnector.send(msg)
		LSLog("LSGateWay->serverStartOn:"+IP + " port:"+PORT)
	}
	//新服务器连接进来,但是现在无法知道服务器的具体信息
	this.newServerComein = function(newServer)
	{
		if(newServer)
		{
			self.serverArray.push(newServer)
			LSLog("LSGateWay->newServerComein:当前数量为:"+self.serverArray.length);
			newServer.regisit(MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,self.newServerReportInfo)
		}
	}
	//服务器状态发生改变的时候.Info里面有服务器的名称,状态,类型等信息
	this.newServerReportInfo = function(Server,Info)
	{
		if(Server && Info)
		{
			Server.setState(LSCONNECTION_STATE.LSCONNECTION_ON_CONNECTTING);
			Server.setServerState(Info.SERVER_STATE)
			Server.setServerName(Info.SERVER_NAME)
			LSLog("LSGateWay->newServerReportInfo:欢迎服务器 :"+Info.SERVER_NAME+" 的加入")

			var msg = {}
			msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
			msg.TEXT = "欢迎你";
			Server.send(msg);
		}
		//TODO:通知所有客户端,服务器状态变化
	}
	this.newServerDisConnect = function (Server,Info)
	{
		if(Server)
		{
			if(this.serverArray.remove(Server))
			{
				LSLog("LSGateWay->newServerDisConnect: :"+Server.getServerName()+" 关闭"+ ",剩余服务器数量:"+self.serverArray.length);
			}else{
				LSLog("LSGateWay->newServerDisConnect: :"+Server.getServerName()+" 关闭失败,没有找到这个服务器"+ ",剩余服务器数量:"+self.serverArray.length);
			}

		}
	}
	init();
}

console.log(process.argv[2],process.argv[3]);
LSGateWay(process.argv[2],process.argv[3]);





