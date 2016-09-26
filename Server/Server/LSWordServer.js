/*
	作用：非副本类的地图管理器,例如主城,野外等
*/

var net = require('net')
var ClientConnection = require("../Connection/LSServerListClientConnection").LSServerClientConnection;
var ClientUnit = require("../Connection/LSServerListClientConnection").LSServerClientUnit;//等待客户端
var ServerConnection = require("../Connection/LSServerClient").LSServerConnectionClientUnit; //连接其他服务器
var ServerUnit = require("../Model/LSServer").LSServer ;
var MsgDef = require("../Connection/LSMessageDef");
var MsgOperator = require("../Connection/LSMessageOpeator").LSMessageOpeator; //连接其他服务器

function LSWordServer(IP,PORT)
{
	this.allClients = new Array()
	var self = this;
	this.run = function()
	{
		this.serverConnection = new  ServerConnection(IP,PORT,this.onServerConnected,this.onServerData,this.onServerDisConnect,this.onServerError);
		this.clientConnection = new  ClientConnection(this.onNewClient,0); 
		this.serverConnection.connection()
		this.clientConnection.startListen()
		this.operator = new MsgOperator(this.serverConnection.socket);
		this.operator.regisit(MsgDef.MSG_WORDSERVER_TO_GATEWAY_WORDSERVERINFO,this.onFirstConnection);
		this.operator.regisit(MsgDef.MSG_WORDSERVER_TO_GATEWAY_TEST,this.onSecondSpeak);
	}
	//收到GateWay回复
	this.onSecondSpeak = function(DATA)
	{
		console.log("接受:",DATA)
	}
	this.onFirstConnection = function(DATA)
	{
		console.log(DATA)
		self.operator.send({MSG:MsgDef.MSG_WORDSERVER_TO_GATEWAY_TEST,TEXT:"我已经开始工作了"})
	}
	//connection with ateWay
	this.onServerData = function(Data)
	{
		self.operator.onData(Data)
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
	//发送给GateWay
	this.reportGateWayInfo = function()
	{
		var msgOjb = {
			"MSG" : MsgDef.MSG_WORDSERVER_TO_GATEWAY_WORDSERVERINFO,
			"SERVER_NAME" : "主城服务器",
			"SERVER_TYPE" : 1
		};
		self.operator.send(msgOjb)
	}

	//玩家连接进来
	this.onNewClient = function(CLIENT)
	{
		console.log("新客户端来了")
	}
}

console.log(process.argv[2],process.argv[3]);
var server = new LSWordServer(process.argv[2],process.argv[3]);
server.run()
