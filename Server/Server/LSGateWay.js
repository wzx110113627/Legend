/*
	作用:各个游戏服务器的网关,启动之后会主动联系ServerList服务器
	启动顺序:启动之后先连接 ServerList->启动服务器连接服务->启动客户端连接服务器
*/

var LSServerConnecter = require("../Connection/LSServerConnecter");
var LSLog = require("../public/LSCommondHandle").LSLog;
var MSG = require("../Connection/LSMessageDef");
var LSServerMaker = require("../Manager/LSServerMaker");
var LSPlayerMaker = require("../Manager/LSPlayerMaker");
var LSEventQueue = require("../Manager/LSEventQueue");
var LSEvent = require("../Manager/LSEventQueue").LSEvent;
var LSEVENT_TYPE = require("../Manager/LSEventQueue").LSEVENT_TYPE;
var LSCreateWordServer = require("../public/LSCommondHandle").LSCreateWordServer;
require("../public/LSHelper");

var count = 0;

function LSGateWay(IP,PORT)
{
	var self = this;
	function init()
	{
		self.serverArray = new Array()
		self.clientArray = new Array();
		self.events = new LSEventQueue();
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


		self.playerMaker = new LSPlayerMaker(
			self.playerMakerStartOn,
			self.newClientComein,
			self.clientDisConnect,
			0
		)
		self.playerMaker.startListen();

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
			Server.setServerID(Info.SERVER_ID);
			Server.ip= Info.SERVER_IP;
			Server.port = Info.SERVER_PORT
			LSLog("LSGateWay->newServerReportInfo:欢迎服务器 :"+Info.SERVER_NAME+" 的加入" + " ServerID:" + Info.SERVER_ID)

			var msg = {}
			msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
			msg.TEXT = "欢迎你";
			Server.send(msg);

			var event = self.events.getCreateServerEvent(Info.SERVER_ID);
			if(event)
			{//清理掉创建服务器事件
				self.events.removeEvent(event);
				LSLog("清理了创建服务器的事件");
			}
			var events = self.events.getLoginEvents(Info.SERVER_ID);
			LSLog("查看有哪些人要连接到新服务器:"+events.length);
			if(events.length > 0)
			{//处理之前需要连接过来的角色

				for(var i = 0 ; i < events.length;i++)
				{
					var event = events[i];
					var msg ={};
					msg.MSG = MSG.MSG_GATEWAY_PLAY_WITH_ROLE;
					msg.IP = Info.SERVER_IP;
					msg.PORT = Info.SERVER_PORT;
					msg.ROLE_GUID = event.userInfo.userGuid;
					msg.R = 0;
					event.userInfo.client.send(msg);
				}
				self.events.removeEvents(events);
			}
		}
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

	this.getUID = function () {
		return count++;
	}

	//所有客户端的操作
	this.playerMakerStartOn = function (IP,PORT) {
		self.clentIP = IP; //客户端连接的IP
		self.clentPort = PORT;//客户端连接的端口
		console.log("self.clentIP :"+IP + " self.clentPort:" + PORT)
		var msg = {}
		msg.MSG = MSG.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO;
		msg.SERVER_NAME = "雄霸天下"+self.getUID();
		msg.SERVER_STATE = 1;
		msg.SERVER_IP = self.clentIP;
		msg.SERVER_PORT = PORT;
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
	this.getServerByServerID = function (ServerID) {
		for(var i = 0; i < self.serverArray.length;i++)
		{
			var server = self.serverArray[i];
			if(server.serverID == ServerID)
			{
				return server;
			}
		}
		return null;
	}
	this.clientPlayWithRole = function (Client,Info) {
		//TODO:通过Token验证用户合法性
		//TODO:根据玩家信息查找对应的服务器,如果服务器存在,返回服务器的地址.否则启动服务器,然后再告诉玩家
		//现在却是很多逻辑,所以暂时做一个假的.
		var server = self.getServerByServerID(100);
		if(server)
		{
			var msg = {};
			msg.MSG = MSG.MSG_GATEWAY_PLAY_WITH_ROLE;
			msg.IP = server.ip;
			msg.PORT = server.port;
			msg.ROLE_GUID = self.getUID();
			msg.R = 0;
			Client.send(msg);
		}else{
			LSLog("LSGateWay->clientPlayWithRole:"+"暂时没有ID为100的服务器,需要新创建")
			var event = new LSEvent(LSEVENT_TYPE.LOGIN_SERVER_EVENT);
			var userInfo = {}
			userInfo.serverID = 100;
			userInfo.userGuid = self.getUID();
			userInfo.client = Client;
			event.setUserInfo(userInfo);
			self.events.addEvents(event)
			if(self.events.getCreateServerEvent(100)==null)
			{
				LSCreateWordServer("LSWordServer.js",self.serverIP,self.serverPort,100);
			}
		}
	}

	init();
}

console.log(process.argv[2],process.argv[3]);
LSGateWay(process.argv[2],process.argv[3]);





