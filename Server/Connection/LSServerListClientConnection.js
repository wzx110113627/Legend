/*
	作用:在服务器列表服务器中等待的客户端连接
*/
var MsgOperator = require("../Connection/LSMessageOpeator").LSMessageOpeator; 
var net = require('net')
var LSServerClientUnit =  function(SOCKET,ON_CLOSE)
{
	this.port =  SOCKET.remotePort;
	this.ip   = SOCKET.remoteAddress;
	this.socket =  SOCKET
	var self = this;
	this.operator = new MsgOperator(SOCKET)
	this.operator.setTarget(self)
    SOCKET.on('data',function(data){
    	self.operator.onData(data)
    });

    SOCKET.on('error',function(exception){
        console.log('socket error:' + exception);
        self.socket.end();
    });
    //客户端关闭事件
    SOCKET.on('close',function(data){
    	ON_CLOSE(self,data)
    });

    this.send = function(DATA)
    {
    	self.operator.send(DATA)
    }

    this.regisit = function(ID,CALLBACK)
	{
		self.operator.regisit(ID,CALLBACK)
	}
}
exports.LSServerClientUnit = LSServerClientUnit;
exports.LSServerClientConnection = function(CALLBACK,SERVER_PORT,ON_CLOSE)
{
	this.callBack = CALLBACK;
	var self = this;
	this.startListen = function()
	{
		var server = net.createServer(function(socket){
			socket.setEncoding('utf-8');
			var newServer = new LSServerClientUnit(socket,ON_CLOSE);
			self.callBack(newServer)
		}).listen(SERVER_PORT);
		server.on('listening',function(){
		    console.log("LSServerClientConnection:" + server.address().port);
		});
		server.on("error",function(exception){
		    console.log("LSServerClientConnection error:" + exception);
		});
	}
}