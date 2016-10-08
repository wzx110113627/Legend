/*
	作用:封装和命令行相关的操作
*/
var exec = require('child_process').exec;
var os = require('os');

// 缩短日志书写的名称
exports.LSLog=function(VALUE)
{
	console.log(arguments)
}

/*
	启动一个新的服务器
	p1:网关打开之后，连接的ip
	p2:网关打开之后，连接的端口
	p3:新服务器叫什么名字
	p4:网关服务器文件名称
*/
exports.LSOpenGatWay = function(FILE_NAME,IP,PORT)
{
	var commandText = "forever start " + FILE_NAME + " " + IP + " " + PORT;
	exec(commandText)
}

exports.LSGetIP = function () {
	var IPv4,hostName;
	hostName=os.hostname();
	for(var i=0;i<os.networkInterfaces().en0.length;i++){
		if(os.networkInterfaces().en0[i].family=='IPv4'){
			IPv4=os.networkInterfaces().en0[i].address;
		}
	}
	return IPv4;
}



