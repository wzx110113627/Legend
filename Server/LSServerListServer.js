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

var serverList = null;

function LSServerListServer()
{
	
	this.allServers = new Array()
	this.SERVER_IP = "";
	this.SERVER_PORT = "";
	var self =this;
	this.run = function()
	{
		this.allClients = new Array();
		this.serverConnection = new serverConnection(this.handleAddress,this.onNewServer,this.onServerClose);
		this.clientConnection = new clientConnection(this.onNewClient,SERVER_LIST_PORT);
		this.serverConnection.startListen();
		this.clientConnection.startListen();
		this.serverConnection.SERVER = this;

	}
	this.onServerClose = function(SERVER)
	{
		console.log("LSServerListServer:","当前服务器数量为:",self.allServers.length);
		for (var i = 0; i < self.allServers.length; i++) {
			var cServer = serverList.allServers[i];
			if(cServer == SERVER)
			{
				self.allServers.splice(i,1);
				console.log("onServerClose:","关闭服务器成功")
			}
		};
		console.log("LSServerListServer:","当前服务器数量为:",self.allServers.length);
	}
	this.handleAddress = function(IP,PORT)
	{
		this.SERVER_IP = IP;
		this.SERVER_PORT = PORT;
		console.log(IP,PORT)
		OpenGateWay("LSGateWay.js",IP,PORT)
		OpenGateWay("LSGateWay.js",IP,PORT)
		OpenGateWay("LSGateWay.js",IP,PORT)
		OpenGateWay("LSGateWay.js",IP,PORT)
	}
	this.onNewServer = function(SERVER)
	{
		self.allServers.push(SERVER)
		console.log("LSServerListServer:","新服务器连接进来，当前服务器数量为:",self.allServers.length)
	}
	this.onNewClient = function(CLIENT)
	{
		serverList.allClients.push(CLIENT);
	}
};

serverList = new LSServerListServer();

serverList.run();

