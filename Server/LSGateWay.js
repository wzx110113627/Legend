/*
	作用:各个游戏服务器的网关,启动之后会主动联系ServerList服务器
*/

var net = require('net')
var ClientConnection = require("../Connection/LSServerListClientConnection").LSServerClientConnection;
var ClientUnit = require("../Connection/LSServerListClientConnection").LSServerClientUnit;//等待客户端
var ServerConnection = require("../Connection/LSServerClient").LSServerConnectionClientUnit; //连接其他服务器
var ServerUnit = require("../Model/LSServer").LSServer ;

function LSGateWay(IP,PORT)
{
	//this.serverInfo = SERVER_INFO;
	this.allClients = new Array()
	

	this.run = function()
	{
		this.serverConnection = new  ServerConnection(IP,PORT,this.onServerConnected,this.onServerData,this.onServerDisConnect,this.onServerError);
		this.clientConnection = new  ClientConnection(this.onNewClient,0); 
		this.serverConnection.connection()
		this.clientConnection.startListen()
	}
	this.onServerData = function(Data)
	{
		
	}
	this.onServerConnected = function()
	{
		console.log("LSGateWay:","连接成功");
	}
	this.onServerDisConnect = function()
	{
		console.log("onServerDisConnect: 已与列表服务器断开连接，关闭程序")
		process.exit()
	}
	this.onServerError = function(exception)
	{
		console.log("onServerError:",exception)
	}

	this.onNewClient = function(CLIENT)
	{
		console.log("新客户端来了")
	}
}


console.log(process.argv[2],process.argv[3]);
var server = new LSGateWay(process.argv[2],process.argv[3]);
server.run()





