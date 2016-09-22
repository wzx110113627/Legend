/*
	作用：服务器之间通信时候，作为客户端的连接单元
*/

var net = require('net')
exports.LSServerConnectionClientUnit =  function(IP,PORT,ON_CONNECTION,ON_DATA,ON_DISCONNECTION,ON_ERROR)
{
	var client  = new net.Socket();
	client.setEncoding('binary');

	this.client = client;
	this.connection = function()
	{
		client.connect(PORT,IP,function(){
		    ON_CONNECTION(this);
		});
		client.on('data',ON_DATA);
		client.on('error',ON_ERROR);
		client.on('close',ON_DISCONNECTION);
	}
    this.closeConnection = function()
    {
    	this.socket.end();
    }
}