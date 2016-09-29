/*
	作用:这个文件是服务器的入口文件，所有的客户端都连接这个服务器查询服务器列表以及服务器的状态等信息
*/
 
var LSLog = require("../public/LSCommondHandle").LSLog;
var Server = require("../Model/LSServer").LSServer ;
var serverConnection = require("../Connection/LSGateWayConnection").LSGateWayServerConnection;
var serverUnit = require("../Connection/LSGateWayConnection").LSGateWayUnit;
var clientConnection = require("../Connection/LSServerListClientConnection").LSServerClientConnection;
var clientUnit = require("../Connection/LSServerListClientConnection").LSServerClientUnit;
var OpenGateWay = require("../public/LSCommondHandle").LSOpenGatWay;
var SERVER_LIST_PORT = 48562
var MsgDef = require("../Connection/LSMessageDef");

var serverList = null;

function LSServerListServer()
{
	this.allServers = {}
	this.SERVER_IP = "";
	this.SERVER_PORT = "";
	var self =this;
	this.run = function()
	{
		this.allClients = new Array();
		this.serverConnection = new serverConnection(this.handleAddress,this.onNewServer,this.onServerClose,MsgDef.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO);
		this.clientConnection = new clientConnection(this.onNewClient,SERVER_LIST_PORT,this.onClientClose);
		this.serverConnection.startListen();
		this.clientConnection.startListen();

	}
	this.onServerClose = function(SERVER)
	{
		if(self.allServers[SERVER.serverName])
		{
			delete self.allServers[SERVER.serverName];
			self.allServers[SERVER.serverName] = null;
		}
	}
	this.handleAddress = function(IP,PORT)
	{
		this.SERVER_IP = IP;
		this.SERVER_PORT = PORT;
		console.log("服务器连接地址:",IP,PORT)
		console.log("客户端连接地址:",IP,SERVER_LIST_PORT)
		// OpenGateWay("LSGateWay.js",IP,PORT)
		// OpenGateWay("LSGateWay.js",IP,PORT)
		// OpenGateWay("LSGateWay.js",IP,PORT)
		// OpenGateWay("LSGateWay.js",IP,PORT)
	}
	this.serverSpeak = function(DATA,SERVER)
	{
		console.log("接受:",DATA);
		SERVER.send({MSG:MsgDef.MSG_GATEWAY_TO_SERVERLIST_TEST,TEXT:"好的，我知道了"+SERVER.serverName})
	}
	this.onNewServer = function(SERVER)
	{
		if(self.allServers[SERVER.serverName]==null)
		{
			self.allServers[SERVER.serverName] = SERVER;
			//注册服务器相应事件
			SERVER.regisit(MsgDef.MSG_GATEWAY_TO_SERVERLIST_TEST,self.serverSpeak);

			console.log("新服务器:",SERVER.serverName,"加入");
			SERVER.send({MSG:MsgDef.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,TEXT:"欢迎你"+SERVER.serverName})
			self.synicServerInfoToClient()
		}else{
			console.log("ERROR:重复的服务器名称:",SERVER.serverName)
		}
	}

	this.getServerInfoForClient = function()
	{
		var serverList = new Array()
		for (var key in self.allServers) {
			var server = self.allServers[key]
			serverList.push(server.getInfo())
		};
		return serverList;
	}
	// 客户端连接
	this.synicServerInfoToClient = function()
	{
		var serverInfo = self.getServerInfoForClient();
		var msg = {MSG:MsgDef.MSG_CLIENT_SERVER_REQUEST_SERVERLIST,LIST:serverInfo};
		for(var i = 0 ; i < self.allClients.length; i++)
		{
			var client = self.allClients[i]
			client.send(msg)
		}
	}
	this.onClientClose = function(DATA,CLIENT)
	{
		for(var i = 0 ; i < self.allClients.length; i++)
		{
			var client = self.allClients[i]
			if(client == CLIENT)
			{
				self.allClients.splice(i,1)
				return;
			}
		}
		console.log("客户端退出,剩余数量:",self.allClients.length)

	}
	this.onClientRequestServerState = function(DATA,CLIENT)
	{
		console.log("客户端查询服务器状态:")
		var serverInfo = self.getServerInfoForClient();

		CLIENT.send({MSG:MsgDef.MSG_CLIENT_SERVER_REQUEST_SERVERLIST,LIST:serverInfo});
	}
	this.onNewClient = function(CLIENT)
	{
		serverList.allClients.push(CLIENT);
		CLIENT.regisit(MsgDef.MSG_CLIENT_SERVER_REQUEST_SERVERLIST,self.onClientRequestServerState)
		console.log("新客户端加入")
	}
};

serverList = new LSServerListServer();

serverList.run();

