/*
	作用:各个游戏服务器的网关,启动之后会主动联系ServerList服务器
*/

var net = require('net')
var ClientConnection = require("../Connection/LSServerListClientConnection").LSServerClientConnection;
var ClientUnit = require("../Connection/LSServerListClientConnection").LSServerClientUnit;//等待客户端
var ServerConnection = require("../Connection/LSServerClient").LSServerConnectionClientUnit; //连接其他服务器
var ServerUnit = require("../Model/LSServer").LSServer ;
var MsgDef = require("../Connection/LSMessageDef");
var MsgOperator = require("../Connection/LSMessageOpeator").LSMessageOpeator; //连接其他服务器
var WordServerConnection = require("../Connection/LSGateWayConnection").LSGateWayServerConnection;
var WordServerUnit = require("../Connection/LSGateWayConnection").LSGateWayUnit;

function LSGateWay(IP,PORT)
{
	this.allClients = new Array()
	this.allServers = {}
	var self = this;
	this.run = function()
	{
		//链接ServerList
		this.serverConnection = new  ServerConnection(IP,PORT,this.onServerConnected,this.onServerData,this.onServerDisConnect,this.onServerError);
		this.serverConnection.connection()
		this.serverListoperator = new MsgOperator(this.serverConnection.socket);
		this.serverListoperator.regisit(MsgDef.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,this.onFirstConnection);
		this.serverListoperator.regisit(MsgDef.MSG_GATEWAY_TO_SERVERLIST_TEST,this.onServerListSpeak);


		this.worldServerConnection = new WordServerConnection(this.handleAddress,this.onNewWorldServer,this.onWorldServerClose,MsgDef.MSG_WORDSERVER_TO_GATEWAY_WORDSERVERINFO);
		this.worldServerConnection.startListen()
		//等待客户端链接
		this.clientConnection = new  ClientConnection(this.onNewClient,0); 
		this.clientConnection.startListen()	
	}

	this.onServerSpeak = function(DATA,SERVER)
	{
		console.log("接受:",SERVER.serverName,DATA)
		SERVER.send({MSG:MsgDef.MSG_WORDSERVER_TO_GATEWAY_TEST,TEXT:"加油，好好干"})
	}

	this.handleAddress = function(IP,PORT)
	{
		self.worldIP = IP;
		self.worldPORT = PORT;
		console.log("被链接的地址:",IP,PORT)

	}
	this.onNewWorldServer = function(SERVER)
	{
		if(self.allServers[SERVER.serverName]==null)
		{
			console.log("新服务器:",SERVER.serverName,"加入");
			self.allServers[SERVER.serverName] = SERVER;
			SERVER.regisit(MsgDef.MSG_WORDSERVER_TO_GATEWAY_TEST,self.onServerSpeak)

			SERVER.send({MSG:MsgDef.MSG_WORDSERVER_TO_GATEWAY_WORDSERVERINFO,TEXT:"欢迎你"+SERVER.serverName})
		}else{
			console.log("ERROR:重复的服务器名称:",SERVER.serverName)
		}
	}
	this.onWorldServerClose = function(SERVER)
	{	
		if(self.allServers[SERVER.serverName])
		{
			delete self.allServers[SERVER.serverName];
			self.allServers[SERVER.serverName] = null;
			console.log("服务器关闭:",SERVER.serverName)
		}
	}


	//收到ServerList回复

	this.onServerListSpeak = function(DATA)
	{
		console.log("接受:",DATA)
	}
	this.onFirstConnection = function(DATA)
	{
		console.log("接受:",DATA)
		self.serverListoperator.send({MSG:MsgDef.MSG_GATEWAY_TO_SERVERLIST_TEST,TEXT:"我已经准备好工作了"})

	}
	//connection with ServerList
	this.onServerData = function(Data)
	{
		self.serverListoperator.onData(Data)
	}
	this.onServerConnected = function()
	{
		console.log("LSGateWay:","连接成功");
		self.reportGateWayInfo();
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
	//发送给ServerList
	this.reportGateWayInfo = function()
	{
		var msgOjb = {
			"MSG" : MsgDef.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO,
			"SERVER_NAME" : "雄霸天下",
			"SERVER_ID" : 1
		};
		self.serverListoperator.send(msgOjb)
	}

	//client
	this.onNewClient = function(CLIENT)
	{
		console.log("新客户端来了")
	}
}


console.log(process.argv[2],process.argv[3]);
var server = new LSGateWay(process.argv[2],process.argv[3]);
server.run()





