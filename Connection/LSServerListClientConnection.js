/*
	作用:在服务器列表服务器中等待的客户端连接
*/


var net = require('net')
exports.LSServerClientUnit =  function(SOCKET)
{
	this.port =  SOCKET.remotePort;
	this.ip   = SOCKET.remoteAddress;
	this.socket =  SOCKET

    SOCKET.on('data',function(data){

    });

    SOCKET.on('error',function(exception){
        console.log('socket error:' + exception);
        this.socket.end();
    });
    //客户端关闭事件
    SOCKET.on('close',function(data){
    	
    });
}

exports.LSServerClientConnection = function(CALLBACK,SERVER_PORT)
{
	this.callBack = CALLBACK;
	this.startListen = function()
	{
		var server = net.createServer(function(socket){
			socket.setEncoding('binary');
			var newServer = new LSGateWayClientUnit(socket);
			this.callBack(newServer)
		}).listen(SERVER_PORT);
		server.on('listening',function(){
		    console.log("LSServerClientConnection:" + server.address().port);
		});
		server.on("error",function(exception){
		    console.log("LSServerClientConnection error:" + exception);
		});
	}
}