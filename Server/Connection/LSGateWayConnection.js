/*
	作用:各个服务器的网关与List服务器之间的连接
*/

var net = require('net')
var os = require('os'); 
var MsgDef = require("../Connection/LSMessageDef");
var MsgOperator = require("../Connection/LSMessageOpeator").LSMessageOpeator; 
var LSGateWayUnit =  function(ON_CLOSE)
{
	var self = this;
	this.setSocket = function(OPERATOR,SOCKET)
	{
		self.SERVER_PORT = SOCKET.remotePort;
		self.SERVER_IP   = SOCKET.remoteAddress;
		console.log("--------",SOCKET.remotePort,SOCKET.remoteAddress)
		self.socket =  SOCKET;
		self.operator = OPERATOR;
		SOCKET.on('data',self.onData);
		SOCKET.on('error',self.onError);
		SOCKET.on('close',this.onClose);
	}
	this.setInfo = function(SERVER_ID,SERVER_NAME)
	{
		self.serverID = SERVER_ID;
		self.serverName = SERVER_NAME;
	}
	this.getInfo = function()
	{
		return {NAME:self.serverName,STATE:0};
	}
	this.onData = function(data){
		self.operator.onData(data)
	}
	this.onError = function(exception)
	{
		console.log('socket error:' + exception);
	    self.socket.end();
	}
	this.onClose = function()
	{
		ON_CLOSE(self);
	}

    this.send = function(DATA)
    {
    	self.operator.send(DATA)
    }

    this.regisit = function(ID,CALLBACK)
	{
		self.operator.regisit(ID,CALLBACK)
	}
}
exports.LSGateWayUnit = LSGateWayUnit;
exports.LSGateWayServerConnection = function(ADDRESS_CALLBACK,CALLBACK,ON_CLOSE,MESSAGE_TYPE)
{
	var self = this;
	this.startListen = function()
	{
		var IPv4,hostName;  
		hostName=os.hostname();  
		for(var i=0;i<os.networkInterfaces().en0.length;i++){  
		    if(os.networkInterfaces().en0[i].family=='IPv4'){  
		        IPv4=os.networkInterfaces().en0[i].address;  
		    }  
		}
		var server = net.createServer(function(socket){

			socket.setEncoding('utf-8');
			var newServer = new LSGateWayUnit(ON_CLOSE)
			var msgOperator = new MsgOperator(socket); 
			msgOperator.setTarget(newServer);
			newServer.setSocket(msgOperator,socket)

			msgOperator.regisit(MESSAGE_TYPE,function(MESSAGE,SERVER){
				if(MESSAGE_TYPE == MsgDef.MSG_GATEWAY_TO_SERVERLIST_GATEWAYINFO)
				{
					newServer.setInfo(MESSAGE.SERVER_ID,MESSAGE.SERVER_NAME);
					CALLBACK(newServer);

				}else if(MESSAGE_TYPE == MsgDef.MSG_WORDSERVER_TO_GATEWAY_WORDSERVERINFO)
				{
					newServer.setInfo(MESSAGE.SERVER_TYPE,MESSAGE.SERVER_NAME);
					CALLBACK(newServer);
				}
				
			})
			

		}).listen(0);
		server.on('listening',function(){
		    ADDRESS_CALLBACK(IPv4,server.address().port)
		});
		server.on("error",function(exception){
		    console.log("LSGateWayServerConnection error:" + exception);
		});
	}
}