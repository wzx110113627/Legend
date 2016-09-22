/*
	作用:各个服务器的网关与List服务器之间的连接
*/

var net = require('net')
var os = require('os'); 

var LSGateWayUnit =  function(SOCKET,ON_CLOSE)
{
	this.port =  SOCKET.remotePort;
	this.ip   = SOCKET.remoteAddress;
	this.socket =  SOCKET
	var self = this;
    SOCKET.on('data',function(data){

    });

    SOCKET.on('error',function(exception){
        console.log('socket error:' + exception);
        this.socket.end();
    });
    //客户端关闭事件
    SOCKET.on('close',function(data){
    	ON_CLOSE(self);
    });
}
exports.LSGateWayUnit = LSGateWayUnit;
exports.LSGateWayServerConnection = function(ADDRESS_CALLBACK,CALLBACK,ON_CLOSE)
{
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
			socket.setEncoding('binary');
			var newServer = new LSGateWayUnit(socket,ON_CLOSE);
			CALLBACK(newServer);

		}).listen(0);
		server.on('listening',function(){
		    ADDRESS_CALLBACK(IPv4,server.address().port)
		});
		server.on("error",function(exception){
		    console.log("LSGateWayServerConnection error:" + exception);
		});
	}
}